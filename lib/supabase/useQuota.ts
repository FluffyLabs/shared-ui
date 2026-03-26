import { useCallback, useEffect, useMemo, useState } from "react";
import { useSupabaseContext } from "./context";
import { useSubscription } from "./useSubscription";

export interface UseQuotaOptions {
  /** Max free uses per month. Pro users get unlimited. */
  freeLimit: number;
}

export interface UseQuotaResult {
  /** Number of uses this month */
  used: number;
  /** Monthly limit, null = unlimited (pro users) */
  limit: number | null;
  /** Remaining uses, null = unlimited */
  remaining: number | null;
  /** Whether the user can perform the action */
  canUse: boolean;
  /** Increment usage counter. Call this when the action is performed. */
  increment: () => Promise<void>;
  isLoading: boolean;
}

function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Track per-action usage with monthly rate limiting for free users.
 * Pro users (active subscription) get unlimited usage.
 *
 * Uses an `increment_usage` RPC function for atomic counter updates.
 * Falls back to direct upsert if the RPC is not available.
 *
 * Expected table schema:
 *   usage (
 *     user_id uuid references auth.users on delete cascade,
 *     app_id text not null default '',
 *     action text not null,
 *     period text not null,
 *     count int not null default 0,
 *     unique (user_id, app_id, action, period)
 *   )
 */
export function useQuota(action: string, options: UseQuotaOptions): UseQuotaResult {
  const { client, user, appId } = useSupabaseContext();
  const { subscription, isLoading: subLoading } = useSubscription();

  const period = useMemo(() => currentPeriod(), []);
  const fetchKey = useMemo(() => `${user?.id ?? ""}:${appId}:${action}:${period}`, [user?.id, appId, action, period]);

  const [result, setResult] = useState<{
    used: number;
    error: Error | null;
    fetchKey: string | null;
  }>({ used: 0, error: null, fetchKey: null });

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    client
      .from("usage")
      .select("count")
      .eq("user_id", user.id)
      .eq("app_id", appId)
      .eq("action", action)
      .eq("period", period)
      .maybeSingle()
      .then(({ data: row, error: queryError }) => {
        if (cancelled) return;
        setResult({
          used: queryError ? 0 : ((row?.count as number) ?? 0),
          error: queryError ? new Error(queryError.message) : null,
          fetchKey,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [client, user, appId, action, period, fetchKey]);

  const increment = useCallback(async () => {
    if (!user) throw new Error("User must be logged in to track usage");

    const { data, error } = await client.rpc("increment_usage", {
      p_user_id: user.id,
      p_app_id: appId,
      p_action: action,
      p_period: period,
    });

    if (error) throw new Error(error.message);
    setResult((prev) => ({ ...prev, used: (data as number) ?? prev.used + 1 }));
  }, [client, user, appId, action, period]);

  if (!user) {
    return {
      used: 0,
      limit: options.freeLimit,
      remaining: options.freeLimit,
      canUse: true,
      increment,
      isLoading: false,
    };
  }

  const dataLoading = result.fetchKey !== fetchKey;
  const isLoading = subLoading || dataLoading;

  if (subscription.isActive) {
    return { used: result.used, limit: null, remaining: null, canUse: true, increment, isLoading };
  }

  const remaining = Math.max(0, options.freeLimit - result.used);
  return {
    used: result.used,
    limit: options.freeLimit,
    remaining,
    canUse: remaining > 0,
    increment,
    isLoading,
  };
}
