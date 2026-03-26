import { useEffect, useMemo, useState } from "react";
import { useSupabaseContext } from "./context";

export type SubscriptionPlan = "free" | "pro";
export type SubscriptionState = "free" | "active" | "cancelled";

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionState;
  /** Whether the user has an active Pro subscription right now */
  isActive: boolean;
  /** End of current billing period (ISO string), null for free users */
  currentPeriodEnd: string | null;
}

export interface UseSubscriptionResult {
  subscription: SubscriptionInfo;
  isLoading: boolean;
  error: Error | null;
}

const FREE_SUBSCRIPTION: SubscriptionInfo = {
  plan: "free",
  status: "free",
  isActive: false,
  currentPeriodEnd: null,
};

/**
 * Read the current user's subscription status from the `subscriptions` table.
 *
 * Expected table schema:
 *   subscriptions (
 *     user_id uuid PK references auth.users,
 *     status text not null default 'free',
 *     stripe_customer_id text,
 *     stripe_subscription_id text,
 *     current_period_end timestamptz,
 *     created_at timestamptz,
 *     updated_at timestamptz
 *   )
 */
export function useSubscription(): UseSubscriptionResult {
  const { client, user } = useSupabaseContext();

  const fetchKey = useMemo(() => user?.id ?? "", [user?.id]);

  const [result, setResult] = useState<{
    subscription: SubscriptionInfo;
    error: Error | null;
    fetchKey: string | null;
  }>({ subscription: FREE_SUBSCRIPTION, error: null, fetchKey: null });

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    client
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data: row, error: queryError }) => {
        if (cancelled) return;

        if (queryError) {
          setResult({ subscription: FREE_SUBSCRIPTION, error: new Error(queryError.message), fetchKey });
          return;
        }

        if (!row || row.status === "free") {
          setResult({ subscription: FREE_SUBSCRIPTION, error: null, fetchKey });
          return;
        }

        const periodEnd = row.current_period_end as string | null;
        const isExpired = periodEnd ? new Date(periodEnd) < new Date() : false;
        const isActive = row.status === "active" && !isExpired;

        setResult({
          subscription: {
            plan: isActive ? "pro" : "free",
            status: row.status as SubscriptionState,
            isActive,
            currentPeriodEnd: periodEnd,
          },
          error: null,
          fetchKey,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [client, user, fetchKey]);

  if (!user) {
    return { subscription: FREE_SUBSCRIPTION, isLoading: false, error: null };
  }

  const isLoading = result.fetchKey !== fetchKey;

  return { subscription: result.subscription, isLoading, error: result.error };
}
