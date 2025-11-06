import { cn } from "@/utils";
import * as React from "react";
import { alertIntentColors, type AlertIntent } from "./alert-intent";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  intent?: AlertIntent;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AlertTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const AlertRoot = React.forwardRef<HTMLDivElement, AlertProps>(({ className, intent = "neutral", ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertIntentColors({ intent }), "relative w-full rounded-lg border px-4 py-3", className)}
      {...props}
    />
  );
});
AlertRoot.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(({ className, ...props }, ref) => {
  return (
    <h5 ref={ref} className={cn("mb-2 font-semibold text-sm leading-none tracking-tight", className)} {...props} />
  );
});
AlertTitle.displayName = "Alert.Title";

const AlertText = React.forwardRef<HTMLParagraphElement, AlertTextProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("text-sm", className)} {...props} />;
});
AlertText.displayName = "Alert.Text";

export const Alert = Object.assign(AlertRoot, {
  Title: AlertTitle,
  Text: AlertText,
});
