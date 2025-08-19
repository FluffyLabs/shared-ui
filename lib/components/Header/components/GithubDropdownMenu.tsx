import { ChevronDown, EllipsisVertical, ExternalLink } from "lucide-react";
import { useIsSmallBreakpoint } from "@/hooks";
import { Button } from "@/ui/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";

export const GithubDropdownMenu = ({ ghRepoName }: { ghRepoName: string }) => {
  const isSmall = useIsSmallBreakpoint();

  return (
    <DropdownMenu>
      {!isSmall && (
        <DropdownMenuTrigger asChild>
          <Button variant="outlineBrand" forcedColorScheme="dark" className={"mr-4 px-3 h-[32px]"}>
            Github&nbsp;
            <ChevronDown className="ml-2 h-5 w-4" />
          </Button>
        </DropdownMenuTrigger>
      )}

      {isSmall && (
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" forcedColorScheme="dark" className={"text-brand mr-4 px-3 h-[32px]"}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent className="bg-[#242424] mt-1 p-4 border-none text-white min-w-[315px]">
        <DropdownMenuItem
          onSelect={() => window.open(`https://github.com/FluffyLabs/${ghRepoName}/issues/new`, "_blank")}
          className="pl-3 py-3 flex items-start justify-between hover:bg-[#2D2D2D] focus:bg-[#2D2D2D] focus:text-white"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium mb-1">Report an issue or suggestion</span>
            <span className="text-xs text-muted-foreground">Go to the issue creation page</span>
          </div>
          <ExternalLink className="text-brand-dark dark:text-brand" size={16} />
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => window.open(`https://github.com/FluffyLabs/${ghRepoName}`, "_blank")}
          className="pl-3 py-3 flex items-start justify-between hover:bg-[#2D2D2D] focus:bg-[#2D2D2D] focus:text-whit"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium mb-1">Star us on Github to show support</span>
            <span className="text-xs text-muted-foreground">Visit our Github</span>
          </div>
          <ExternalLink className="text-brand-dark dark:text-brand" size={16} />
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => window.open(`https://github.com/FluffyLabs/${ghRepoName}/fork`, "_blank")}
          className="pl-3 py-3 flex items-start justify-between hover:bg-[#2D2D2D] focus:bg-[#2D2D2D] focus:text-whit"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium mb-1">Fork & contribute</span>
            <span className="text-xs text-muted-foreground pt-1">Opens the fork creation page</span>
          </div>
          <ExternalLink className="text-brand-dark dark:text-brand" size={16} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
