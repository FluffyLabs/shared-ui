import { cn } from "@/utils";
import { useQuota } from "./useQuota";
import { PricingCard } from "./PricingCard";

export interface QuotaGateProps {
  /** Action type for quota tracking (e.g., "decode", "analyze") */
  action: string;
  /** Max free uses per month */
  freeLimit: number;
  /** Callback to handle checkout (create Stripe session via Edge Function) */
  onCheckout: () => void;
  children: React.ReactNode;
  className?: string;
}

export function QuotaGate({ action, freeLimit, onCheckout, children, className }: QuotaGateProps) {
  const { canUse, used, limit, remaining, isLoading } = useQuota(action, { freeLimit });

  if (isLoading) return null;

  if (!canUse) {
    return (
      <div className={cn("mx-auto flex w-full max-w-lg flex-col items-center gap-6 p-6", className)}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Free limit reached</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;ve used {used} of {limit} free {action} actions this month. Upgrade to Pro for unlimited access.
          </p>
        </div>
        <PricingCard onCheckout={onCheckout} />
      </div>
    );
  }

  return (
    <div className={className}>
      {limit !== null && remaining !== null && (
        <div className="mb-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-muted">
            <div
              className={cn("h-1.5 rounded-full transition-all", used / limit > 0.8 ? "bg-warning" : "bg-brand")}
              style={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
            />
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {remaining} of {limit} remaining
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
