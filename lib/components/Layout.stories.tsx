import type { Meta, StoryObj } from "@storybook/react";
import { DemoLayout } from "./DemoLayout";
import { Header } from "./Header";
import { AppsSidebar } from "./AppsSidebar";
import Toolname from "@/assets/tool-name.svg";
import { useEffect } from "react";
import { initializeTheme, useThemeMode } from "./DarkMode";

const meta = {
  title: "Layout/DemoLayout",
  component: DemoLayout,
  parameters: {
    layout: "fullscreen",
  },
  excludeStories: ["DefaultDemoLayout"],
} satisfies Meta<typeof DemoLayout>;

export default meta;

type Story = StoryObj<typeof DemoLayout>;

// export const DefaultDemoLayout: Story = {};

export const DefaultDemoLayout: Story = {
  render: () => {
    return (
      <div>
        <Header endSlot={<div className="text-gray-100 mr-2">End slot content</div>} toolNameSrc={Toolname} />
        <div className="flex h-full w-full items-center justify-center">
          <AppsSidebar activeLink="debugger" />
          <div className="w-full h-full"></div>
        </div>
      </div>
    );
  },
};

export const LayoutWithoutThemeModeSwitcher: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "An example of using Header and AppsSidebar with theme mode switcher off. In such case theme mode toggle is not shown and and proper theme (auto, light or dark) needs to be initialized manually usgin `intializeTheme()` function.",
      },
    },
  },
  render: () => {
    useEffect(() => {
      initializeTheme();
    }, []);

    return (
      <div>
        <Header endSlot={<div className="text-gray-100 mr-2">End slot content</div>} toolNameSrc={Toolname} />
        <div className="flex h-full w-full items-center justify-center">
          <AppsSidebar activeLink="debugger" enableDarkModeToggle={false} />
          <div className="w-full h-full"></div>
        </div>
      </div>
    );
  },
};

export const LayoutWithoutThemeModeSwitcher2: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "This is another example of using Header and AppsSidebar with theme mode switcher off. In this case, the theme mode is set to dark mode using `useThemeMode` hook. This story runs in an isolated iframe to prevent localStorage leakage.",
      },
      story: {
        inline: false,
        iframeHeight: 520,
      },
    },
  },
  decorators: [
    (Story) => {
      // Clear localStorage before rendering to isolate this story
      useEffect(() => {
        const storageKey = "theme-mode";
        window.localStorage.removeItem(storageKey);
      }, []);

      return (
        <div style={{ width: "100%", height: "100vh" }}>
          <Story />
        </div>
      );
    },
  ],
  render: () => {
    const [, setThemeMode] = useThemeMode();

    useEffect(() => {
      // Clear localStorage before setting theme
      if (typeof window !== "undefined") {
        const storageKey = "theme-mode";
        window.localStorage.removeItem(storageKey);
      }
      setThemeMode("dark");
    }, [setThemeMode]);

    return (
      <div>
        <Header endSlot={<div className="text-gray-100 mr-2">End slot content</div>} toolNameSrc={Toolname} />
        <div className="flex h-full w-full items-center justify-center">
          <AppsSidebar activeLink="debugger" enableDarkModeToggle={false} />
          <div className="w-full h-full"></div>
        </div>
      </div>
    );
  },
};

export const LayoutWithDarkModeSwitcher: Story = {
  parameters: {
    docs: {
      description: {
        story: "An example of using Header and AppsSidebar with theme switcher on.",
      },
    },
  },
  render: () => {
    return (
      <div>
        <Header endSlot={<div className="text-gray-100 mr-2">End slot content</div>} toolNameSrc={Toolname} />
        <div className="flex h-full w-full items-center justify-center">
          <AppsSidebar activeLink="debugger" />
          <div className="w-full h-full"></div>
        </div>
      </div>
    );
  },
};
