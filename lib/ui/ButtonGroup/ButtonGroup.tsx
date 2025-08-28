import * as React from "react";
import { cn } from "@/utils";
import styles from "./ButtonGroup.module.css";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The orientation of the button group
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles["buttonGroup"],
          orientation === "horizontal" ? styles["horizontal"] : styles["vertical"],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";
