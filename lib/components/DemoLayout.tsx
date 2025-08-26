import { AppsSidebar } from "./AppsSidebar";
import { Content } from "./Content";
import { Header } from "./Header";
import Toolname from "@/assets/tool-name.svg";

export const DemoLayout = () => {
  return (
    <div>
      <Header endSlot={<div className="text-gray-100 mr-2">End slot content</div>} toolNameSrc={Toolname} />
      <div className="flex h-full w-full items-stretch justify-center">
        <AppsSidebar activeLink="debugger" />
        <Content />
      </div>
    </div>
  );
};
