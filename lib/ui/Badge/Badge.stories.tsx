import type { Meta, StoryObj } from "@storybook/react";

import { ToggleDarkModeIcon } from "../../components/DarkMode";
import { Badge } from "./Badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile badge component that can be used to highlight status, categories, or other important information.",
      },
    },
  },
  argTypes: {
    intent: {
      control: "select",
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
    variant: {
      control: "select",
      options: ["outline", "solid"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    children: {
      control: "text",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof Badge>;

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

export const Default: Story = {
  decorators: [ThemeSwitcherDecorator],
  args: {
    children: "Badge",
    variant: "outline",
    size: "medium",
  },
};

const variants = ["outline", "solid"] as const;
const intents = [
  "primary",
  "neutralStrong",
  "neutralMedium",
  "neutralSoft",
  "destructive",
  "success",
  "warning",
  "info",
] as const;
const sizes = ["small", "medium", "large"] as const;

export const AllSizes: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="flex flex-col gap-2 items-start">
      {sizes.map((size) => (
        <Badge key={size} size={size}>
          {size.charAt(0).toUpperCase() + size.slice(1)}
        </Badge>
      ))}
    </div>
  ),
};

export const AllIntents: Story = {
  decorators: [ThemeSwitcherDecorator],
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="p-4 bg-sidebar">
      <div className="flex flex-col gap-6">
        <h3 className="text-lg font-semibold text-foreground">All Variant × Intent Combinations</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse border border-border text-xs">
            <thead>
              <tr>
                <th className="border border-border p-2 text-left font-medium text-foreground bg-muted">
                  Variant / Intent
                </th>
                {intents.map((intent) => (
                  <th
                    key={intent}
                    className="border border-border p-2 text-center font-medium text-foreground bg-muted min-w-[120px]"
                  >
                    {intent}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant}>
                  <td className="border border-border p-2 font-medium text-foreground bg-muted">{variant}</td>
                  {intents.map((intent) => (
                    <td key={`${variant}-${intent}`} className="border border-border p-2 text-center bg-muted/90">
                      <Badge variant={variant} intent={intent} size="small">
                        {variant.slice(0, 3)} / {intent.slice(0, 3)}
                      </Badge>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
};
