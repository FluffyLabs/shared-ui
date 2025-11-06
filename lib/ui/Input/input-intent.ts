import { cva } from "class-variance-authority";

export type InputIntent = "primary" | "neutral" | "destructive" | "success" | "warning";

export const inputIntentColors = cva(
  "placeholder:text-[color-mix(in_srgb,var(--intent-color)_30%,var(--color-muted-foreground))] text-[var(--intent-color)] bg-[color-mix(in_srgb,var(--intent-color)_10%,var(--color-background))] border-[var(--intent-color)] focus-visible:ring-[var(--intent-color)]",
  {
    variants: {
      intent: {
        primary: "[--intent-color:var(--color-brand-primary)]",
        neutral: "placeholder:text-muted-foreground text-foreground bg-background border-input focus-visible:ring-ring",
        destructive: "[--intent-color:var(--color-destructive)]",
        success: "[--intent-color:var(--color-success)]",
        warning: "[--intent-color:var(--color-warning)]",
      },
    },
    defaultVariants: {
      intent: "neutral",
    },
  },
);
