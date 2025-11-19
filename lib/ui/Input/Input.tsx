import { cn } from "@/utils";
import * as React from "react";
import { inputIntentColors, type InputIntent } from "./input-intent";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  intent?: InputIntent;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, intent = "neutral", ...props }, ref) => {
  return (
    <input
      className={cn(
        inputIntentColors({ intent }),
        "flex w-full rounded-md border px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
