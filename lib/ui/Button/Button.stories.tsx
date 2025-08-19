import type { Meta, StoryObj } from "@storybook/react";
import { ToggleDarkModeIcon } from "../../components/DarkMode";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive", "outline", "outlineBrand", "secondary", "ghost", "link"],
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
    },
    forcedColorScheme: {
      control: { type: "select" },
      options: [undefined, "light", "dark"],
    },
    asChild: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

const ThemeSwitcherDecorator = (Story: React.FC) => (
  <div className="p-4 bg-card">
    <div className="flex justify-between items-center mb-4 gap-2">
      <h3 className="text-md font-semibold text-foreground">Theme Switcher</h3>
      <ToggleDarkModeIcon />
    </div>
    <div className="flex flex-col gap-2 items-start">
      <h2 className="text-lg text-foreground">Story</h2>
      <Story />
    </div>
  </div>
);

// All variants showcase
export const AllVariants: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-4 bg-card">
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">All Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="outlineBrand">Outline Brand</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">All Sizes</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">×</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Disabled States</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" disabled>
              Default
            </Button>
            <Button variant="destructive" disabled>
              Destructive
            </Button>
            <Button variant="outline" disabled>
              Outline
            </Button>
            <Button variant="outlineBrand" disabled>
              Outline Brand
            </Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="ghost" disabled>
              Ghost
            </Button>
            <Button variant="link" disabled>
              Link
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Forced Dark Color Scheme</h3>
          <div className="flex flex-wrap gap-4 dark bg-[var(--card)] py-4 px-4">
            <Button variant="outline" forcedColorScheme="dark">
              Outline Dark
            </Button>
            <Button variant="outlineBrand" forcedColorScheme="dark">
              Outline Brand Dark
            </Button>
            <Button variant="ghost" forcedColorScheme="dark">
              asdasd
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Individual variant stories
export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const OutlineBrand: Story = {
  args: {
    children: "Outline Brand",
    variant: "outlineBrand",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
  decorators: [ThemeSwitcherDecorator],
};

// Size variations
export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Icon: Story = {
  args: {
    children: "×",
    size: "icon",
  },
  decorators: [ThemeSwitcherDecorator],
};

// Forced color scheme variations
export const OutlineWithForcedDark: Story = {
  args: {
    children: "Forced Dark Mode",
    variant: "outline",
    forcedColorScheme: "dark",
  },
  decorators: [
    (Story) => (
      <div className="flex flex-wrap gap-4 dark bg-[var(--card)] py-4 px-4">
        <Story />
      </div>
    ),
    ThemeSwitcherDecorator,
  ],
};

export const OutlineBrandWithForcedDark: Story = {
  args: {
    children: "Forced Dark Mode",
    variant: "outlineBrand",
    forcedColorScheme: "dark",
  },
  decorators: [
    (Story) => (
      <div className="flex flex-wrap gap-4 dark bg-[var(--card)] py-4 px-4">
        <Story />
      </div>
    ),
    ThemeSwitcherDecorator,
  ],
};

// Disabled state
export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
  decorators: [ThemeSwitcherDecorator],
};
