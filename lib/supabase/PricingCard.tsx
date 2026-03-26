import { Check } from "lucide-react";
import { Button } from "@/ui/Button";
import { cn } from "@/utils";
import { useSubscription } from "./useSubscription";

export interface PricingCardProps {
  planName?: string;
  price?: string;
  period?: string;
  features?: string[];
  onCheckout: () => void;
  className?: string;
}

export function PricingCard({
  planName = "Pro",
  price = "$5",
  period = "/month",
  features = ["Unlimited usage across all tools", "Priority support", "Early access to new features"],
  onCheckout,
  className,
}: PricingCardProps) {
  const { subscription, isLoading } = useSubscription();

  return (
    <div className={cn("flex w-full max-w-sm flex-col rounded-lg border bg-card p-6", className)}>
      <h3 className="text-lg font-semibold text-foreground">{planName}</h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            {feature}
          </li>
        ))}
      </ul>

      <Button onClick={onCheckout} disabled={isLoading || subscription.isActive} className="mt-6">
        {subscription.isActive ? "Current plan" : "Upgrade to Pro"}
      </Button>
    </div>
  );
}
