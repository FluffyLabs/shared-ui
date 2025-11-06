import { cn } from "@/utils";
import * as React from "react";
import { intentColors, type Intent } from "../Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  intent?: Intent;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, intent = "neutral", ...props }, ref) => {
    return (
      <textarea
        className={cn(
          intentColors({ intent }),
          "flex min-h-[80px] w-full rounded-md border x-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
