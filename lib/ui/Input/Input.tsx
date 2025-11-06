import { cn } from "@/utils";
import * as React from "react";
import { intentColors, type Intent } from "./input-intent";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  intent?: Intent;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, intent = "neutral", ...props }, ref) => {
  console.log(intent);
  return (
    <input
      className={cn(
        intentColors({ intent }),
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
