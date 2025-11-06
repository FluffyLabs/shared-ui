import { cva } from "class-variance-authority";

export type AlertIntent = "primary" | "neutral" | "destructive" | "success" | "warning";

export const alertIntentColors = cva(
  "bg-[color-mix(in_srgb,var(--intent-color)_10%,var(--color-background))] border-[var(--intent-color)] text-[var(--intent-color)]",
  {
    variants: {
      intent: {
        primary: "[--intent-color:var(--color-brand-primary)]",
        neutral: "bg-background border-border text-foreground",
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
