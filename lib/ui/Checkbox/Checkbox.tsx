import { Root, type CheckboxProps, Indicator } from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type * as React from "react";
import { cn } from "@/utils";

const Checkbox: React.FC<
  CheckboxProps & {
    variant?: "default" | "secondary";
    ref?: React.ForwardedRef<HTMLButtonElement>;
  }
> = ({ className, variant = "default", ref, ...props }) => (
  <Root
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
      variant === "secondary"
        ? "border-neutral-medium bg-card data-[state=checked]:bg-neutral-medium data-[state=checked]:border-neutral-medium data-[state=checked]:text-background"
        : "border-neutral-strong bg-background data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary data-[state=checked]:text-white dark:data-[state=checked]:text-background",
      className,
    )}
    {...props}
    ref={ref}
  >
    <Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-3 w-3" strokeWidth={3} />
    </Indicator>
  </Root>
);
Checkbox.displayName = Root.displayName;

export { Checkbox };
