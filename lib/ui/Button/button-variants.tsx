import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--btn-tone)] text-[var(--btn-tone-contrast)] hover:bg-[var(--btn-tone)]/75",
        secondary:
          "border-1 border-[var(--btn-tone)] text-neutral-medium text-[var(--btn-text)] hover:bg-[var(--btn-tone-2nd)]",
        tertiary:
          "border-1 border-neutral-medium text-neutral-medium shadow-[1px_1px_0_#ffffff] hover:border-[var(--btn-tone)] hover:text-[var(--btn-tone)] hover:bg-[var(--btn-tone-2nd)]" +
          " dark:shadow-none dark:border-neutral-soft dark:hover:border-[var(--btn-tone)]",
        ghost: "border-0 text-neutral-medium text-[var(--btn-text)] hover:bg-[var(--btn-tone-2nd)]",
      },
      intent: {
        primary:
          "[--btn-tone:var(--color-brand-primary)] [--btn-tone-contrast:var(--color-brand-lightest)] [--btn-tone-2nd:var(--color-brand-fourth)] [--btn-text:var(--color-brand-darkest)] dark:[--btn-tone-contrast:var(--color-background)] dark:[--btn-text:var(--color-brand)]",
        neutralStrong:
          "[--btn-tone:var(--color-neutral-strong)] [--btn-tone-contrast:var(--color-background)] [--btn-tone-2nd:color-mix(in_hsl,var(--color-neutral-strong)_05%,transparent)] [--btn-text:var(--color-neutral-strong)]",
        neutralMedium:
          "[--btn-tone:var(--color-neutral-medium)] [--btn-tone-contrast:var(--color-background)] [--btn-tone-2nd:color-mix(in_hsl,var(--color-neutral-medium)_05%,transparent)] [--btn-text:var(--color-neutral-medium)]",
        neturalSoft:
          "[--btn-tone:var(--color-neutral-soft)] [--btn-tone-contrast:var(--color-background)] [--btn-tone-2nd:color-mix(in_hsl,var(--color-neutral-medium)_05%,transparent)] [--btn-text:var(--color-neutral-soft)]",
        destructive:
          "[--btn-tone:var(--color-destructive)] [--btn-tone-contrast:var(--color-destructive-foreground)] [--btn-tone-2nd:color-mix(in_hsl,var(--color-destructive-foreground)_50%,transparent)] [--btn-text:var(--color-destructive)] dark:[--btn-tone-2nd:color-mix(in_hsl,var(--color-destructive)_25%,transparent)]",
        success:
          "[--btn-tone:var(--color-success)] [--btn-tone-contrast:var(--color-success-foreground)] [--btn-tone-2nd:color-mix(in_hsl,var(--color-success-foreground)_100%,transparent)] [--btn-text:var(--color-success)] dark:[--btn-tone-2nd:color-mix(in_hsl,var(--color-success)_20%,transparent)]",
        warning:
          "[--btn-tone:var(--color-warning)] [--btn-tone-contrast:var(--color-warning-foreground)] [--btn-tone-2nd:color-mix(in_hsl,var(--color-warning)_15%,transparent)] [--btn-text:var(--color-warning-foreground)]",
        info: "[--btn-tone:var(--color-info)] [--btn-tone-contrast:var(--color-info-foreground)] [--btn-tone-2nd:color-mix(in_hsl,var(--color-info)_10%,transparent)] [--btn-text:var(--color-info-foreground)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-4 w-4 -mt-2",
      },
      forcedColorScheme: {
        light: "",
        dark: "dark",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        intent: "warning",
        class: "hover:bg-[var(--btn-tone)]/55",
      },
      {
        variant: "tertiary",
        intent: "primary",
        class:
          "[--btn-tone:var(--color-brand-very-dark)] dark:[--btn-tone:var(--color-brand)] hover:border-[var(--btn-tone)]/25",
      },
      {
        variant: "tertiary",
        intent: "neutralMedium",
        class: "border-neutral-soft text-neutral-soft [--btn-tone:var(--color-neutral-medium)]",
      },
      {
        variant: "tertiary",
        intent: "warning",
        class: "hover:text-[var(--btn-tone-contrast)]",
      },
      {
        variant: "tertiary",
        intent: "info",
        class: "hover:text-[var(--btn-tone-contrast)]",
      },
      {
        variant: "ghost",
        intent: "success",
        class: "[--btn-tone-2nd:color-mix(in_hsl,var(--color-success)_25%,transparent)]",
      },
      {
        variant: "ghost",
        intent: "destructive",
        class: "[--btn-tone-2nd:color-mix(in_hsl,var(--color-destructive)_25%,transparent)]",
      },
      {
        variant: "ghost",
        intent: "primary",
        class:
          "[--btn-tone-2nd:var(--color-brand-tertiary)] dark:[--btn-tone-2nd:var(--color-brand-fourth)] [--btn-text:var(--color-brand-dark)]" +
          " ",
      },
      // {
      // 	forcedColorScheme: "dark",
      // 	variant: "secondary",
      // 	intent: "neutralStrong",
      // 	class:
      // 		"bg-transparent border-[var(--border)] dark:text-[var(--title-foreground)] hover:bg-[var(--title)] hover:text-[var(--accent-foreground)] focus-visible:ring-[var(--brand)] focus-visible:ring-offset-[var(--card)]",
      // },
      // {
      // 	forcedColorScheme: "dark",
      // 	variant: "secondary",
      // 	intent: "primary",
      // 	class:
      // 		"text-brand bg-transparent focus:bg-[var(--card)] hover:focus:bg-brand-darkest hover:text-brand focus-visible:ring-[var(--brand)] focus-visible:ring-offset-[var(--card)]",
      // },
      // {
      // 	forcedColorScheme: "dark",
      // 	variant: "tertiary",
      // 	intent: "neutralStrong",
      // 	class:
      // 		"bg-transparent focus:bg-[var(--card)] hover:bg-[var(--title)] focus-visible:shadow-none focus-visible:ring-[var(--brand)] focus-visible:ring-offset-[var(--card)]",
      // },
    ],
    defaultVariants: {
      variant: "primary",
      intent: "primary",
      size: "default",
    },
  },
);
