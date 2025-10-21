import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/utils";

export default {};
const badgeVariants = cva(
  "font-inconsolota inline-block pb-0.25 pt-0 px-4 text-base rounded-xl lowercase border bg-[var(--badge-tone-light)] [color:var(--badge-tone-contrast,var(--badge-tone))] border-[var(--badge-tone)]",
  {
    variants: {
      intent: {
        primary: "[--badge-tone:var(--color-brand-primary)] [--badge-tone-light:var(--color-brand-tertiary)]",
        neutralStrong:
          "[--badge-tone:var(--color-neutral-strong)] [--badge-tone-light:color-mix(in_srgb,var(--color-neutral-strong)_15%,white)] dark:[--badge-tone-light:color-mix(in_srgb,var(--color-neutral-strong)_15%,black)]",
        neutralMedium:
          "[--badge-tone:var(--color-neutral-medium)] [--badge-tone-light:color-mix(in_srgb,var(--color-neutral-medium)_15%,white)] dark:[--badge-tone-light:color-mix(in_srgb,var(--color-neutral-medium)_15%,black)]",
        neutralSoft:
          "[--badge-tone:var(--color-neutral-soft)] [--badge-tone-light:color-mix(in_srgb,var(--color-neutral-soft)_15%,white)] dark:[--badge-tone-light:color-mix(in_srgb,var(--color-neutral-soft)_15%,black)]",
        destructive:
          "[--badge-tone:var(--color-destructive)] [--badge-tone-light:var(--color-destructive-foreground))] dark:[--badge-tone-light:color-mix(in_srgb,var(--color-destructive)_30%,black)]",
        success:
          "[--badge-tone:var(--color-success)] [--badge-tone-light:var(--color-success-foreground))] dark:[--badge-tone-light:color-mix(in_srgb,var(--color-success)_30%,black)]",
        warning:
          "[--badge-tone:var(--color-warning)] [--badge-tone-light:color-mix(in_srgb,var(--color-warning)_25%,white)] [--badge-tone-contrast:var(--color-warning-foreground)] dark:[--badge-tone-contrast:var(--color-warning)] dark:[--badge-tone-light:color-mix(in_srgb,var(--color-warning)_30%,black)]",
        info: "[--badge-tone:var(--color-info)] dark:[--badge-tone:var(--color-info)] [--badge-tone-light:color-mix(in_srgb,var(--color-info)_25%,white)] dark:[--badge-tone-light:color-mix(in_srgb,var(--color-info)_30%,black)]",
      },
      variant: {
        solid: "bg-[var(--badge-tone)] text-[var(--badge-tone-light)] dark:text-[var(--badge-tone-contrast)]",
        outline: "",
      },
      size: {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        intent: "warning",
        class: "dark:[--badge-tone-contrast:var(--color-background)]",
      },
      {
        variant: "solid",
        intent: "neutralSoft",
        class: "dark:[--badge-tone-contrast:var(--color-foreground)]/50 text-[var(--badge-tone-contrast)]",
      },
    ],
    defaultVariants: {
      intent: "primary",
      variant: "outline",
      size: "medium",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, intent, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ intent, variant, size, className }))} {...props} />;
}

export { Badge };
