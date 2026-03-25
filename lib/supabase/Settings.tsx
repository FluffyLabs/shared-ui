import { ToggleDarkMode } from "@/components/DarkMode";
import { cn } from "@/utils";

export interface SettingsProps {
  className?: string;
}

export function Settings({ className }: SettingsProps) {
  return (
    <div className={cn("mx-auto flex w-full max-w-md flex-col gap-6 p-6", className)}>
      <h2 className="text-lg font-semibold text-foreground">Settings</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Theme</p>
          <p className="text-xs text-muted-foreground">Select your preferred color scheme</p>
        </div>
        <ToggleDarkMode className="w-32" />
      </div>
    </div>
  );
}
