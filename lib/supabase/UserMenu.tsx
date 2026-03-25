import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { Button } from "@/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/DropdownMenu/dropdown-menu";
import { useUser } from "./useUser";
import { useSignOut } from "./useSignOut";

export interface UserMenuProps {
  onSettingsClick?: () => void;
  onLoginClick?: () => void;
  /** Show only the username (part before @) instead of full email */
  compact?: boolean;
}

export function UserMenu({ onSettingsClick, onLoginClick, compact }: UserMenuProps) {
  const { user, isLoading } = useUser();
  const signOut = useSignOut();

  if (isLoading) return null;

  if (!user) {
    return (
      <Button variant="secondary" onClick={onLoginClick} forcedColorScheme="dark" className="mr-4 px-3 h-[32px]">
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="tertiary" forcedColorScheme="dark" className="mr-4 px-3 h-[32px]">
          <UserIcon className="h-4 w-4 mr-1" />
          <span className="text-sm max-sm:hidden">
            {compact ? (user.email?.split("@")[0] ?? "User") : (user.email ?? "User")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forcedColorScheme="dark">
        <div className="px-2 py-1.5 text-sm text-muted-foreground sm:hidden">{user.email}</div>
        <DropdownMenuSeparator className="sm:hidden" />
        {onSettingsClick && (
          <DropdownMenuItem onClick={onSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => signOut().catch((e) => console.error("Sign out failed:", e))}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
