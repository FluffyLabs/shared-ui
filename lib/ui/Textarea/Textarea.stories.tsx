import type { Meta, StoryObj } from "@storybook/react";
import { ToggleDarkModeIcon } from "../../components/DarkMode";
import { Textarea } from "./Textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placeholder: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    rows: {
      control: { type: "number" },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof Textarea>;

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

export const AllStates: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-4 bg-card">
      <div className="flex flex-col gap-8 w-80">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Default</h3>
          <Textarea placeholder="Enter your message..." />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">With Value</h3>
          <Textarea defaultValue="This is a sample text in the textarea component." />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Different Rows</h3>
          <div className="flex flex-col gap-4">
            <Textarea rows={2} placeholder="2 rows..." />
            <Textarea rows={4} placeholder="4 rows..." />
            <Textarea rows={6} placeholder="6 rows..." />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Disabled State</h3>
          <Textarea disabled placeholder="This textarea is disabled" defaultValue="You cannot edit this text." />
        </div>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    placeholder: "Enter your message...",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const WithValue: Story = {
  args: {
    defaultValue:
      "This is a sample text in the textarea component that demonstrates how the component looks with some content.",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Small: Story = {
  args: {
    placeholder: "Small textarea...",
    rows: 2,
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Large: Story = {
  args: {
    placeholder: "Large textarea...",
    rows: 6,
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Disabled: Story = {
  args: {
    placeholder: "This textarea is disabled",
    disabled: true,
    defaultValue: "You cannot edit this text.",
  },
  decorators: [ThemeSwitcherDecorator],
};
