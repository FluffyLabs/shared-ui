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

export const AllIntents: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-4 bg-card">
      <div className="flex flex-col gap-6 w-80">
        <h3 className="text-lg font-semibold text-foreground">Intent Variations</h3>

        <div className="flex flex-col gap-4">
          <h4 className="text-md font-medium text-foreground">Normal State</h4>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Primary</label>
            <Input intent="primary" placeholder="Primary intent input..." />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Neutral (Default)</label>
            <Input intent="neutral" placeholder="Neutral intent input..." />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Destructive</label>
            <Input intent="destructive" placeholder="Destructive intent input..." />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Success</label>
            <Input intent="success" placeholder="Success intent input..." />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Warning</label>
            <Input intent="warning" placeholder="Warning intent input..." />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-md font-medium text-foreground">Disabled State</h4>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Primary (Disabled)</label>
            <Input intent="primary" placeholder="Disabled primary..." disabled />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Neutral (Disabled)</label>
            <Input intent="neutral" placeholder="Disabled neutral..." disabled />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Destructive (Disabled)</label>
            <Input intent="destructive" placeholder="Disabled destructive..." disabled />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Success (Disabled)</label>
            <Input intent="success" placeholder="Disabled success..." disabled />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Warning (Disabled)</label>
            <Input intent="warning" placeholder="Disabled warning..." disabled />
          </div>
        </div>
      </div>
    </div>
  ),
};
