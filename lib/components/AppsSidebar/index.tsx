import { ToggleDarkModeIcon } from "../DarkMode";
import { Stack } from "./icons/Stack";
import { Debugger } from "./icons/Debugger";
import { Computers } from "./icons/Computers";
import { Chip } from "./icons/Chip";
import { Logo } from "./icons/Logo";
import { cn } from "@/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import type { ReactNode } from "react";
import { Search } from "./icons/Search";

export const AppsSidebar = ({
  activeLink,
  className,
  enableDarkModeToggle = true,
}: {
  activeLink: "debugger" | "reader" | "trie" | "codec" | "website" | "search";
  className?: string;
  enableDarkModeToggle?: boolean;
}) => {
  return (
    <div className={cn("flex flex-col gap-5 bg-sidebar max-sm:hidden", className)}>
      <div className="grow flex flex-col items-center justify-center px-3">
        <SidebarLink
          name="JAM Search"
          href="https://search.fluffylabs.dev"
          icon={<Search />}
          active={activeLink === "search"}
        />
        <SidebarLink
          name="Gray Paper Reader"
          href="https://graypaper.fluffylabs.dev"
          icon={<Stack />}
          active={activeLink === "reader"}
        />
        <SidebarLink
          name="PVM Debugger"
          href="https://pvm.fluffylabs.dev"
          icon={<Debugger />}
          active={activeLink === "debugger"}
        />
        <SidebarLink
          name="Trie Visualiser"
          href="https://trie.fluffylabs.dev"
          icon={<Computers />}
          active={activeLink === "trie"}
        />
        {/*<SidebarLink
          name="??"
          href="#"
          icon={<Brick />}
          />*/}
        <SidebarLink
          name="JAM Codec"
          href="https://papi.fluffylabs.dev"
          icon={<Chip />}
          active={activeLink === "codec"}
        />
        <SidebarLink
          name="Fluffy Labs Website"
          href="https://fluffylabs.dev"
          icon={<Logo />}
          active={activeLink === "website"}
        />
      </div>

      {enableDarkModeToggle && (
        <div className="py-4 border-t flex justify-center border-gray-300 dark:border-gray-600">
          <ToggleDarkModeIcon />
        </div>
      )}
    </div>
  );
};

type SidebarLinkProps = {
  name: string;
  href: string;
  active?: boolean;
  icon: React.ReactNode;
};
function SidebarLink({ name, href, icon, active = false }: SidebarLinkProps) {
  return (
    <WithTooltip tooltip={name}>
      <a
        target={active === false ? "_blank" : undefined}
        rel={active === false ? "noreferrer" : undefined}
        href={href}
        className={cn(
          "p-2 border rounded-full my-3",
          "shadow-[1px_1px_0_#ffffff] dark:shadow-none",
          "hover:text-[#639894] hover:bg-[#F2FFFE] hover:border-[#BBDAD8]",
          "dark:hover:text-[#61EDE2] dark:hover:bg-[#0E3532] dark:hover:border-[#61EDE2]",
          {
            "text-[#639894] bg-[#F2FFFE] border-[#BBDAD8]": active,
            "dark:text-[#61EDE2] dark:bg-[#0E3532] dark:border-[#61EDE2]": active,
            "text-[#BBBBBB] bg-[#F5F5F5] border-[#D4D4D4]": !active,
            "dark:text-[#525252] dark:bg-[#242424] dark:border-[#3D3D3D]": !active,
          },
        )}
      >
        <div className="block h-[30px] w-[30px] max-w-none">{icon}</div>
      </a>
    </WithTooltip>
  );
}

function WithTooltip({ tooltip, children }: { tooltip: string; children: ReactNode }) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
