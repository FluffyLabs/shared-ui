import type { Meta, StoryObj } from "@storybook/react";
import { useId, useState } from "react";
import { cn } from "@/utils";
import { ToggleDarkModeIcon } from "../../components/DarkMode";
import { Switch } from "./Switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [undefined, "secondary"],
    },
    checked: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    onCheckedChange: {
      action: "checkedChange",
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof Switch>;

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

// Simple Label component for stories
const Label = ({ htmlFor, className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label htmlFor={htmlFor} className={className} {...props}>
    {children}
  </label>
);

export const AllVariants: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    return (
      <div className="bg-card flex flex-col gap-2">
        <div className="flex gap-4 items-center justify-between">
          <div className="text-foreground">Primary/default</div>
          <Switch />
        </div>
        <div className="flex gap-4 items-center justify-between">
          <div className="text-foreground ">Secondary</div>
          <Switch variant="secondary" />
        </div>
      </div>
    );
  },
};

export const AllVariantsAndState: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-4 bg-card">
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">All Variants</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch />
              <span className="text-sm text-foreground">Default</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch variant="secondary" />
              <span className="text-sm text-foreground">Secondary</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Checked States</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch checked={false} />
              <span className="text-sm text-foreground">Unchecked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={true} />
              <span className="text-sm text-foreground">Checked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch variant="secondary" checked={false} />
              <span className="text-sm text-foreground">Secondary Unchecked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch variant="secondary" checked={true} />
              <span className="text-sm text-foreground">Secondary Checked</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Disabled States</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch disabled />
              <span className="text-sm text-foreground opacity-50">Disabled Unchecked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch disabled checked />
              <span className="text-sm text-foreground opacity-50">Disabled Checked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch variant="secondary" disabled />
              <span className="text-sm text-foreground opacity-50">Secondary Disabled Unchecked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Switch variant="secondary" disabled checked />
              <span className="text-sm text-foreground opacity-50">Secondary Disabled Checked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    checked: false,
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Checked: Story = {
  args: {
    checked: true,
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    checked: false,
  },
  decorators: [ThemeSwitcherDecorator],
};

export const SecondaryChecked: Story = {
  args: {
    variant: "secondary",
    checked: true,
  },
  decorators: [ThemeSwitcherDecorator],
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false,
  },
  decorators: [ThemeSwitcherDecorator],
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
  decorators: [ThemeSwitcherDecorator],
};

export const WithLabel: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const id = useId();

    return (
      <div className="flex items-center space-x-2">
        <Label htmlFor={id} className="text-sm text-foreground">
          Enable feature
        </Label>
        <Switch id={id} checked={isEnabled} onCheckedChange={setIsEnabled} />
      </div>
    );
  },
};

export const NumericalSystemToggle: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    const [isHex, setIsHex] = useState(false);
    const id = useId();

    return (
      <div className="flex items-center space-x-2">
        <Label
          htmlFor={id}
          className={cn("text-xs", !isHex ? "dark:text-[#F6F7F9] sm:text-white" : "text-[#5C5C5C] sm:text-[#858585]")}
        >
          Dec
        </Label>
        <Switch className="border-[#3B4040]" id={id} checked={isHex} onCheckedChange={setIsHex} />
        <Label
          htmlFor={id}
          className={cn("text-xs", isHex ? "dark:text-[#F6F7F9] sm:text-white" : "text-[#5C5C5C] sm:text-[#858585]")}
        >
          Hex
        </Label>
      </div>
    );
  },
};

export const ControlledSwitch: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    const [notifications, setNotifications] = useState(false);
    const [marketing, setMarketing] = useState(true);
    const [analytics, setAnalytics] = useState(false);
    const notificationsId = useId();
    const marketingId = useId();
    const analyticsId = useId();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={notificationsId} className="text-sm font-medium text-foreground">
            Push Notifications
          </Label>
          <Switch id={notificationsId} checked={notifications} onCheckedChange={setNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor={marketingId} className="text-sm font-medium text-foreground">
            Marketing Emails
          </Label>
          <Switch id={marketingId} variant="secondary" checked={marketing} onCheckedChange={setMarketing} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor={analyticsId} className="text-sm font-medium text-foreground opacity-50">
            Analytics (Disabled)
          </Label>
          <Switch id={analyticsId} checked={analytics} disabled onCheckedChange={setAnalytics} />
        </div>
      </div>
    );
  },
};
