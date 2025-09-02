import Logo from "@/assets/logo.svg";
import Brand from "@/assets/brand.svg";

import { Separator } from "@radix-ui/react-separator";
import { Badge } from "@/ui/badge";
import { createContext, useContext, useMemo, type FC, type JSX } from "react";
import { GithubDropdownMenu } from "./components/GithubDropdownMenu";
import { cn } from "@/utils";

type HeaderContextValue = {
  ghRepoName: string;
};

const HeaderContext = createContext<HeaderContextValue | null>(null);

export const HeaderComponent = ({
  endSlot,
  toolNameSrc,
  ghRepoName = "pvm-debugger",
  keepNameWhenSmall = false,
}: {
  endSlot?: JSX.Element;
  toolNameSrc: string;
  ghRepoName?: string;
  keepNameWhenSmall?: boolean;
}) => {
  const contextValue = useMemo(
    () => ({
      ghRepoName,
    }),
    [ghRepoName],
  );

  return (
    <HeaderContext.Provider value={contextValue}>
      <div className="bg-[#242424] w-full flex flex-row items-center justify-between py-[18px] text-xs overflow-hidden border-b border-b-secondary-foreground dark:border-b-brand sm:gap-12 max-w-svw max-h-dvw">
        <div className="flex items-center gap-5">
          <a href="/" className="flex items-center pl-4 shrink-0">
            <img src={Logo} alt="FluffyLabs logo" className="h-[40px] max-w-fit" />
            <img src={Brand} alt="FluffyLabs brand" className="max-sm:hidden md:inline ml-4 h-[28px]" />
          </a>
          <Separator className="bg-gray-600 w-[1px] h-[40px] sm:h-[50px] " orientation="vertical" />
          <div
            className={cn(
              "flex max-sm:flex-col-reverse items-end md:items-center h-[50px]",
              !keepNameWhenSmall && "max-sm:hidden",
            )}
          >
            <img src={toolNameSrc} alt="FluffyLabs brand" className="h-[40px] shrink-0" />
            <div className="shrink sm:ml-1 sm:mb-4">
              <Environment />
            </div>
          </div>
        </div>
        <div className="flex items-center max-sm:ml-2 justify-end gap-2 shrink">
          {!!endSlot && endSlot}
          {!endSlot && <GithubDropdownMenu ghRepoName={ghRepoName} />}
        </div>
      </div>
    </HeaderContext.Provider>
  );
};

const GithubDropdownMenuWithContext: FC<{ className?: string }> = ({ className }) => {
  const contextValue = useContext(HeaderContext);

  if (!contextValue) return null;

  const { ghRepoName } = contextValue;
  return <GithubDropdownMenu ghRepoName={ghRepoName} className={className} />;
};

export const Header = Object.assign(HeaderComponent, {
  GithubDropdownMenu: GithubDropdownMenuWithContext,
});

const Environment = () => {
  const badgeName = getRightBadgeName();

  if (!badgeName) return null;

  return (
    <Badge className="px-2 py-[0.5px] sm:py-1 bg-brand text-[10px] max-sm:text-[7px] text-black whitespace-nowrap hover:bg-brand">
      {badgeName}
    </Badge>
  );
};

function getRightBadgeName() {
  if (isSubdomainOfFullyLabs()) {
    return undefined;
  }
  if (isPreviewSubdomain()) {
    return "PR preview";
  }
  if (isSubdomainOfNetlifyApp()) {
    return "beta";
  }
  return "dev";
}

const isSubdomainOfFullyLabs = () => {
  const { host } = window.location;
  return host.endsWith(".fluffylabs.dev");
};

const isSubdomainOfNetlifyApp = () => {
  const { host } = window.location;
  return host.endsWith(".netlify.app");
};

const isPreviewSubdomain = () => {
  const { host } = window.location;
  return host.endsWith(".netlify.app") && host.startsWith("deploy-preview");
};
