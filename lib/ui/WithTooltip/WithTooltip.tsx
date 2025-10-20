import { PopoverTrigger } from "@radix-ui/react-popover";
import { InfoIcon } from "lucide-react";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { Popover, PopoverContent } from "../Popover";

type PopoverSide = "top" | "right" | "bottom" | "left";
type PopoverAlign = "start" | "center" | "end";

interface WithTooltipContextValue {
  help: string;
  side?: PopoverSide;
  align?: PopoverAlign;
}

const WithTooltipContext = createContext<WithTooltipContextValue | null>(null);

function useWithTooltipContext() {
  const context = useContext(WithTooltipContext);
  if (!context) {
    throw new Error("WithTooltip compound components must be used within WithTooltip");
  }
  return context;
}

function WithTooltipIcon() {
  const { help, side = "top", align = "center" } = useWithTooltipContext();

  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex h-5 p-0.5 align-bottom cursor-pointer hover:bg-brand-primary/10 rounded-xl"
        tabIndex={-1}
      >
        <InfoIcon className="inline-block text-brand-primary" height="100%" />
      </PopoverTrigger>
      <PopoverContent className="max-w-[300px]" side={side} align={align}>
        <p className="text-left text-xs">{help}</p>
      </PopoverContent>
    </Popover>
  );
}

interface WithTooltipProps {
  help: string;
  children: ReactNode;
  side?: PopoverSide;
  align?: PopoverAlign;
}

function WithTooltip({ help, children, side = "top", align = "center" }: WithTooltipProps) {
  const providerValue = useMemo(
    () => ({
      help,
      side,
      align,
    }),
    [help, side, align],
  );

  return (
    <WithTooltipContext.Provider value={providerValue}>
      <span className="inline-flex items-center gap-1">{children}</span>
    </WithTooltipContext.Provider>
  );
}

WithTooltip.Icon = WithTooltipIcon;

export { WithTooltip };
export type { PopoverSide, PopoverAlign };
