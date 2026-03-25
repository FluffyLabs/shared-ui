import { useCallback, useEffect, useMemo, useState } from "react";
import { useSupabaseContext } from "./context";

export interface UseUserDataOptions {
  appScoped?: boolean;
}

export interface UseUserDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  save: (value: T) => Promise<void>;
  remove: () => Promise<void>;
}

/**
 * Read and write per-user key-value data from the `user_data` table.
 *
 * Expected table schema:
 *   user_data (id uuid PK, user_id uuid, app_id text not null default '', key text, value jsonb)
 *   unique constraint on (user_id, app_id, key)
 *
 * By default reads/writes shared data (app_id = '').
 * Pass `{ appScoped: true }` to scope data to the current app's `appId`.
 */
export function useUserData<T = unknown>(key: string, options?: UseUserDataOptions): UseUserDataResult<T> {
  const { client, user, appId } = useSupabaseContext();
  const effectiveAppId = options?.appScoped ? appId : "";

  // A key that changes whenever the fetch inputs change, used to derive isLoading
  // without calling setState synchronously in the effect body.
  const fetchKey = useMemo(() => `${user?.id ?? ""}:${key}:${effectiveAppId ?? ""}`, [user?.id, key, effectiveAppId]);

  const [result, setResult] = useState<{
    data: T | null;
    error: Error | null;
    fetchKey: string | null;
  }>({ data: null, error: null, fetchKey: null });

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    let query = client.from("user_data").select("value").eq("user_id", user.id).eq("key", key);

    query = query.eq("app_id", effectiveAppId);

    query.maybeSingle().then(({ data: row, error: queryError }) => {
      if (cancelled) return;
      setResult({
        data: queryError ? null : ((row?.value as T) ?? null),
        error: queryError ? new Error(queryError.message) : null,
        fetchKey,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [client, user, key, effectiveAppId, fetchKey]);

  const save = useCallback(
    async (value: T) => {
      if (!user) throw new Error("User must be logged in to save data");

      const { error: upsertError } = await client
        .from("user_data")
        .upsert({ user_id: user.id, app_id: effectiveAppId, key, value }, { onConflict: "user_id,app_id,key" });

      if (upsertError) throw new Error(upsertError.message);
      setResult((prev) => ({ ...prev, data: value }));
    },
    [client, user, key, effectiveAppId],
  );

  const remove = useCallback(async () => {
    if (!user) throw new Error("User must be logged in to remove data");

    const { error: deleteError } = await client
      .from("user_data")
      .delete()
      .eq("user_id", user.id)
      .eq("app_id", effectiveAppId)
      .eq("key", key);
    if (deleteError) throw new Error(deleteError.message);
    setResult((prev) => ({ ...prev, data: null }));
  }, [client, user, key, effectiveAppId]);

  if (!user) {
    return { data: null, isLoading: false, error: null, save, remove };
  }

  // Loading is derived: true when the latest fetch hasn't completed yet
  const isLoading = result.fetchKey !== fetchKey;

  return { data: result.data, isLoading, error: result.error, save, remove };
}
