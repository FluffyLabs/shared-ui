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
    <Comp className={cn(`flex flex-col w-full h-full bg-card pb-3 rounded-lg border-1`, className)}>{children}</Comp>
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
    <Comp className={cn(`flex flex-col px-7 pt-[30px] h-full overflow-auto text-foreground text-sm`, className)}>
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
        <div className="px-5 mt-[30px]">
          <Separator />
        </div>
      )}
      <Comp className={cn("m-6 mb-7 flex justify-end", className)}>{children}</Comp>
    </>
  );
};

const DialogHeader = ({
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
      className={cn(
        "sm:mb-4 bg-brand-dark dark:bg-brand/65 text-white text-xs font-light px-3 pt-3 pb-2 rounded-t-lg",
        className,
      )}
    >
      {children}
    </Comp>
  );
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
