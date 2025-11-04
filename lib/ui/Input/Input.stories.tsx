import type { Meta, StoryObj } from "@storybook/react";
import { ToggleDarkModeIcon } from "../../components/DarkMode";
import { Input } from "./Input";

const meta = {
  title: "UI/Input",
  component: Input,
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
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof Input>;

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
          <Input placeholder="Enter your message..." />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">With Value</h3>
          <Input defaultValue="This is a sample text in the textarea component." />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Disabled State</h3>
          <Input disabled placeholder="This textarea is disabled" defaultValue="You cannot edit this text." />
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

export const Disabled: Story = {
  args: {
    placeholder: "This textarea is disabled",
    disabled: true,
    defaultValue: "You cannot edit this text.",
  },
  decorators: [ThemeSwitcherDecorator],
};
