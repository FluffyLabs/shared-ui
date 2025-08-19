import { Moon, Sun, SunMoon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { initializeTheme, useThemeMode } from "./theme-utils";

const ARBITRARY_ALMOST_INSTANT_DELAY_IN_MS = 250; // ms

export const ToggleDarkMode = ({ className }: { className: string }) => {
  const [themeMode, setThemeMode] = useThemeMode();

  const onClick = (val: string) => {
    setThemeMode(val as "light" | "dark" | "auto");
  };

  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <Select onValueChange={onClick} defaultValue={themeMode}>
      <SelectTrigger
        onClick={(e) => {
          e.currentTarget.blur();
          document.body.focus();

          e.stopPropagation();
          // document.querySelector('[role="dialog"]')?.removeAttribute("aria-hidden");
        }}
        className={className}
      >
        <SelectValue
          onClick={(e) => {
            e.currentTarget.blur();
            document.body.focus();
          }}
        />
      </SelectTrigger>
      <SelectContent
        onClick={(e) => {
          e.currentTarget.blur();
          document.body.focus();
          e.stopPropagation();
        }}
      >
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="auto">
          <div className="flex items-center gap-2">
            <SunMoon className="h-4 w-4" />
            <span>Auto</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export const ToggleDarkModeIcon = () => {
  const [themeMode, setThemeMode] = useThemeMode();

  const handleClick = () => {
    // Cycle through: light -> dark -> auto -> light
    const nextMode = themeMode === "light" ? "dark" : themeMode === "dark" ? "auto" : "light";

    setThemeMode(nextMode);
  };

  const getIcon = () => {
    switch (themeMode) {
      case "light":
        return <Sun width="30px" />;
      case "dark":
        return <Moon width="30px" />;
      case "auto":
        return <SunMoon width="30px" />;
    }
  };

  const getTooltip = () => {
    switch (themeMode) {
      case "light":
        return "Light Mode";
      case "dark":
        return "Dark Mode";
      case "auto":
        return "Auto Dark/Light Mode";
    }
  };

  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <Tooltip delayDuration={ARBITRARY_ALMOST_INSTANT_DELAY_IN_MS}>
      <TooltipTrigger asChild>
        <Button onClick={handleClick} className="text-title-foreground p-2 border rounded" variant="ghost">
          {getIcon()}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{getTooltip()}</TooltipContent>
    </Tooltip>
  );
};

export type { ThemeMode } from "./theme-utils";
export { initializeTheme, useThemeMode } from "./theme-utils";
