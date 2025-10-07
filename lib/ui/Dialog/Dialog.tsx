import { Slot } from "@radix-ui/react-slot";
import type React from "react";
import { cn } from "@/utils";
import { Separator } from "../separator";

export interface DialogProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

const Dialog: React.FC<DialogProps> = ({ className, children, asChild }) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp className={cn(`flex flex-col w-full bg-card rounded-lg border-1 gap-3 pb-4`, className)}>{children}</Comp>
  );
};

const DialogContent = ({
  children,
  className,
  asChild,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      className={cn(`flex flex-col px-7 first:mt-6 h-full overflow-auto text-secondary-foreground text-sm`, className)}
    >
      {children}
    </Comp>
  );
};

const DialogFooter = ({
  children,
  className,
  asChild,
  noSeparator,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  noSeparator?: boolean;
}) => {
  const Comp = asChild ? Slot : "div";
  return (
    <>
      {!noSeparator && (
        <div className="px-7 py-2">
          <Separator />
        </div>
      )}
      <Comp className={cn("flex justify-end px-7", className)}>{children}</Comp>
    </>
  );
};

const DialogHeader = ({
  children,
  className,
  asChild,
  variant = "normal",
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  variant?: "brand" | "normal";
  size?: "md" | "sm";
}) => {
  const Comp = asChild ? Slot : "div";

  const variantClasses = {
    brand: "bg-brand-dark dark:bg-brand/65 text-white",
    normal: "bg-title text-title-foreground",
  };

  const sizeClasses = {
    md: "px-5 pt-4 pb-3 text-sm font-medium",
    sm: "px-3 pt-3 pb-2 text-xs",
  };

  return <Comp className={cn(variantClasses[variant], sizeClasses[size], "rounded-t-lg", className)}>{children}</Comp>;
};

export interface CompoundComponents {
  Content: typeof DialogContent;
  Footer: typeof DialogFooter;
  Header: typeof DialogHeader;
}

const DialogWithCompoundComponents = Dialog as React.FC<DialogProps> & CompoundComponents;

DialogWithCompoundComponents.displayName = "Dialog";

DialogWithCompoundComponents.Content = DialogContent;
DialogWithCompoundComponents.Footer = DialogFooter;
DialogWithCompoundComponents.Header = DialogHeader;

export default DialogWithCompoundComponents;
