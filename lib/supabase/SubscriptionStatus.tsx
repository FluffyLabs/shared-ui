import { cn } from "@/utils";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge/Badge";
import { useSubscription } from "./useSubscription";

export interface SubscriptionStatusProps {
  /** Callback to manage existing subscription (e.g., open Stripe Customer Portal) */
  onManage?: () => void;
  /** Callback to start checkout for new subscription */
  onCheckout?: () => void;
  className?: string;
}

export function SubscriptionStatus({ onManage, onCheckout, className }: SubscriptionStatusProps) {
  const { subscription, isLoading } = useSubscription();

  if (isLoading) return null;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">Subscription</p>
          <Badge intent={subscription.isActive ? "success" : "neutralMedium"} size="small">
            {subscription.isActive ? "Pro" : "Free"}
          </Badge>
        </div>
        {subscription.isActive && subscription.currentPeriodEnd && (
          <p className="text-xs text-muted-foreground">
            Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </p>
        )}
        {!subscription.isActive && (
          <p className="text-xs text-muted-foreground">Upgrade for unlimited access across all tools</p>
        )}
      </div>
      {subscription.isActive && onManage && (
        <Button variant="secondary" size="sm" onClick={onManage}>
          Manage
        </Button>
      )}
      {!subscription.isActive && onCheckout && (
        <Button size="sm" onClick={onCheckout}>
          Upgrade
        </Button>
      )}
    </div>
  );
}
