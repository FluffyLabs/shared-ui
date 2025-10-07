import * as RadixDialog from "@radix-ui/react-dialog";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { cn } from "@/utils";
import Dialog from "../Dialog/Dialog";

interface DialogModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogModalContext = createContext<DialogModalContextType | null>(null);

export const useDialogModal = () => {
  const context = useContext(DialogModalContext);
  if (!context) {
    throw new Error("DialogModal compound components must be used within DialogModal");
  }
  return context;
};

export interface DialogModalProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogModal: React.FC<DialogModalProps> = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DialogModalContext.Provider value={{ open, setOpen }}>
      <RadixDialog.Root open={open} onOpenChange={setOpen}>
        {children}
      </RadixDialog.Root>
    </DialogModalContext.Provider>
  );
};

const DialogModalTrigger: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
}> = ({ children, asChild = true }) => {
  return <RadixDialog.Trigger asChild={asChild}>{children}</RadixDialog.Trigger>;
};

const DialogModalOverlay: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <RadixDialog.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
    />
  );
};

const DialogModalContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <RadixDialog.Portal>
      <DialogModalOverlay />
      <RadixDialog.Content
        className={cn(
          "rounded-lg fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-48% data-[state=open]:slide-in-from-top-48%",
          className,
        )}
      >
        <Dialog className="w-full">{children}</Dialog>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
};

export interface CompoundComponents {
  Trigger: typeof DialogModalTrigger;
  Overlay: typeof DialogModalOverlay;
  Content: typeof DialogModalContent;
}

const DialogModalWithCompoundComponents = DialogModal as React.FC<DialogModalProps> & CompoundComponents;

DialogModalWithCompoundComponents.displayName = "DialogModal";
DialogModalWithCompoundComponents.Trigger = DialogModalTrigger;
DialogModalWithCompoundComponents.Overlay = DialogModalOverlay;
DialogModalWithCompoundComponents.Content = DialogModalContent;

export default DialogModalWithCompoundComponents;
