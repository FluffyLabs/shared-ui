import type { Meta, StoryObj } from "@storybook/react";
import { useId } from "react";

import { ToggleDarkModeIcon } from "../../components/DarkMode";
import { Separator } from "../separator";
import { WithTooltip } from "./WithTooltip";

const meta = {
  title: "UI/WithTooltip",
  component: WithTooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A compound component that displays content with an optional info icon tooltip. The tooltip can appear on different sides and supports both hover and click triggers.",
      },
    },
  },
  argTypes: {
    help: {
      control: "text",
      description: "The help text to display in the tooltip",
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "The preferred side of the trigger to render against",
      defaultValue: "top",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "The preferred alignment of the tooltip",
      defaultValue: "center",
    },
    children: {
      control: false,
      description: "The content to display alongside the tooltip icon",
    },
  },
} satisfies Meta<typeof WithTooltip>;

export default meta;

type Story = StoryObj<typeof WithTooltip>;

const ThemeSwitcherDecorator = (Story: React.FC) => (
  <div className="p-4 bg-card">
    <div className="flex justify-between items-center mb-4 gap-2">
      <h3 className="text-md font-semibold text-foreground">Theme Switcher</h3>
      <ToggleDarkModeIcon />
    </div>
    <div className="flex flex-col gap-2 items-start">
      <h2 className="text-lg text-foreground">Story:</h2>
      <Separator className="mb-4" />
      <Story />
    </div>
  </div>
);

export const Basic: Story = {
  decorators: [ThemeSwitcherDecorator],
  args: {
    help: "This is a helpful tooltip that provides additional context about the content.",
    side: "top",
    align: "center",
  },
  render: (args) => (
    <WithTooltip {...args}>
      <span className="text-foreground">Hover over the icon to see tooltip</span>
      <WithTooltip.Icon />
    </WithTooltip>
  ),
};

export const DifferentPositions: Story = {
  decorators: [ThemeSwitcherDecorator],
  args: {
    help: "This tooltip demonstrates different positioning options.",
  },
  render: (args) => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <WithTooltip {...args} side="top" align="start">
        <span className="text-foreground">Top Start</span>
        <WithTooltip.Icon />
      </WithTooltip>

      <WithTooltip {...args} side="top" align="end">
        <span className="text-foreground">Top End</span>
        <WithTooltip.Icon />
      </WithTooltip>

      <WithTooltip {...args} side="right" align="center">
        <span className="text-foreground">Right Center</span>
        <WithTooltip.Icon />
      </WithTooltip>

      <WithTooltip {...args} side="left" align="center">
        <WithTooltip.Icon />
        <span className="text-foreground">Left Center</span>
      </WithTooltip>

      <WithTooltip {...args} side="bottom" align="start">
        <span className="text-foreground">Bottom Start</span>
        <WithTooltip.Icon />
      </WithTooltip>

      <WithTooltip {...args} side="bottom" align="end">
        <span className="text-foreground">Bottom End</span>
        <WithTooltip.Icon />
      </WithTooltip>
    </div>
  ),
};

export const WithLongTextAndCustomIconPosition: Story = {
  decorators: [ThemeSwitcherDecorator],
  args: {
    help: "This is a much longer tooltip text that demonstrates how the component handles extended content. It should wrap nicely within the maximum width constraint and remain readable.",
    side: "bottom",
    align: "center",
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <WithTooltip {...args}>
        <span className="text-foreground">Long help text example</span>
        <WithTooltip.Icon />
      </WithTooltip>
      <WithTooltip {...args} side="top">
        <WithTooltip.Icon />
        <span className="text-foreground">Icon first, top position</span>
      </WithTooltip>
    </div>
  ),
};

export const InFormContext: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    const nameId = useId();
    const emailId = useId();
    const passwordId = useId();

    return (
      <div className="space-y-4 w-80">
        <div className="space-y-2">
          <WithTooltip help="Your full legal name as it appears on official documents" side="right">
            <label htmlFor={nameId} className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <WithTooltip.Icon />
          </WithTooltip>
          <input
            id={nameId}
            type="text"
            className="w-full p-2 border border-input rounded-md bg-background text-foreground"
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <WithTooltip
            help="We'll use this email for important account notifications and password recovery"
            side="bottom"
          >
            <label htmlFor={emailId} className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <WithTooltip.Icon />
          </WithTooltip>
          <input
            id={emailId}
            type="email"
            className="w-full p-2 border border-input rounded-md bg-background text-foreground"
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <WithTooltip
            help="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
            side="left"
          >
            <label htmlFor={passwordId} className="text-sm font-medium text-foreground">
              Password
            </label>
            <WithTooltip.Icon />
          </WithTooltip>
          <input
            id={passwordId}
            type="password"
            className="w-full p-2 border border-input rounded-md bg-background text-foreground"
            placeholder="Create a secure password"
          />
        </div>
      </div>
    );
  },
};
