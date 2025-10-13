import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { cn } from "@/utils";
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
      options: ["primary", "secondary", "tertiary", "ghost"],
    },
    intent: {
      control: { type: "select" },
      options: [
        "primary",
        "neutralStrong",
        "neutralMedium",
        "neutralSoft",
        "destructive",
        "success",
        "warning",
        "info",
      ],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "lg", "icon"],
    },
    forcedColorScheme: {
      control: { type: "select" },
      options: [undefined, "light", "dark"],
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

export const Interactive: Story = {
  args: {
    children: "Button",
    variant: "primary",
    intent: "primary",
    size: "default",
    disabled: false,
    asChild: false,
  },
  decorators: [ThemeSwitcherDecorator],
};

const variants = ["primary", "secondary", "tertiary", "ghost"] as const;
const intents = [
  "primary",
  "neutralStrong",
  "neutralMedium",
  "neturalSoft",
  "destructive",
  "success",
  "warning",
  "info",
] as const;

export const AllVariants: Story = {
  parameters: {
    layout: "fullscreen",
  },
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    const [forceDark, setForceDark] = useState(false);

    return (
      <div className="p-4 bg-sidebar">
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-6 text-foreground">
              <h3 className="text-lg my-2">Recommended button types</h3>
              <div className="text-foreground text-sm flex flex-col gap-4">
                <div className="flex w-50 justify-between items-center">
                  <div>Primary</div>
                  <Button variant="primary" intent="primary">
                    Primary
                  </Button>
                </div>
                <div className="flex w-50 justify-between items-center">
                  Secondary
                  <Button variant="secondary" intent="primary">
                    Secondary
                  </Button>
                </div>
                <div className="flex w-50 justify-between items-center">
                  Tertiary
                  <Button variant="tertiary" intent="primary">
                    Tertiary
                  </Button>
                </div>
                <div className="flex w-50 justify-between items-center">
                  Ghost (Fourth)
                  <Button variant="ghost" intent="primary">
                    Ghost
                  </Button>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              All Variant × Intent Combinations (Default Size)
            </h3>
            <div className="py-4">
              <Button
                variant="secondary"
                intent="neutralStrong"
                size="sm"
                type="button"
                onClick={() => setForceDark((prev) => !prev)}
              >
                Toggle Force Dark
              </Button>
            </div>
            <div className={cn("overflow-x-auto", forceDark && "dark")}>
              <table className="border-collapse border border-border">
                <thead>
                  <tr>
                    <th className="border border-border p-2 text-left font-medium text-foreground bg-muted text-xs">
                      Variant / Intent
                    </th>
                    {intents.map((intent) => (
                      <th
                        key={intent}
                        className="border border-border p-2 text-center font-medium text-foreground bg-muted min-w-[100px] text-xs"
                      >
                        {intent}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant}>
                      <td className="border border-border p-2 font-medium text-foreground bg-muted/25 text-xs">
                        {variant}
                      </td>
                      {intents.map((intent) => (
                        <td key={`${variant}-${intent}`} className="border border-border p-1 text-center">
                          {variant === "tertiary" && intent === "neturalSoft" ? null : (
                            <Button variant={variant} intent={intent} size="sm">
                              {variant.slice(0, 3)} / {intent.slice(0, 3)}
                            </Button>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const AllOtherCombinations: Story = {
  parameters: {
    layout: "fullscreen",
  },
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    return (
      <div>
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
          <div className="grid grid-cols-3 gap-4">
            {variants.map((variant) => (
              <Button key={`disabled-${variant}`} variant={variant} intent="primary" disabled>
                {variant} (Disabled)
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Forced Dark Color Scheme</h3>
          <div className="grid grid-cols-3 gap-4 dark bg-[var(--card)] py-4 px-4 rounded-lg">
            {variants.map((variant) => (
              <Button key={`dark-${variant}`} variant={variant} intent="primary" forcedColorScheme="dark">
                {variant} (Dark)
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
  },
  decorators: [ThemeSwitcherDecorator],
};

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

export const OutlineWithForcedDark: Story = {
  args: {
    children: "Forced Dark Mode",
    variant: "secondary",
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
    variant: "secondary",
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

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
  decorators: [ThemeSwitcherDecorator],
};
