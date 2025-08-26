import { cn } from "@/utils";
import type { FC, PropsWithChildren } from "react";

export const Content: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "box-border flex-1 w-full relative overflow-hidden bg-sidebar border-l-1 border-l-white dark:border-l-1 dark:border-l-[#353535]",
        className,
      )}
    >
      {children}
    </div>
  );
};
