import type { Meta, StoryObj } from "@storybook/react";
import { useId, useState } from "react";
import { ToggleDarkModeIcon } from "../../components/DarkMode";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary"],
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
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof Checkbox>;

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
          <div className="text-foreground">Default</div>
          <Checkbox />
        </div>
        <div className="flex gap-4 items-center justify-between">
          <div className="text-foreground">Secondary</div>
          <Checkbox variant="secondary" />
        </div>
      </div>
    );
  },
};

export const AllVariantsAndStates: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-4 bg-card">
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">All Variants</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox />
              <span className="text-sm text-foreground">Default</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox variant="secondary" />
              <span className="text-sm text-foreground">Secondary</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Checked States</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox checked={false} />
              <span className="text-sm text-foreground">Unchecked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={true} />
              <span className="text-sm text-foreground">Checked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox variant="secondary" checked={false} />
              <span className="text-sm text-foreground">Secondary Unchecked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox variant="secondary" checked={true} />
              <span className="text-sm text-foreground">Secondary Checked</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Disabled States</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox disabled />
              <span className="text-sm text-foreground opacity-50">Disabled Unchecked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox disabled checked />
              <span className="text-sm text-foreground opacity-50">Disabled Checked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox variant="secondary" disabled />
              <span className="text-sm text-foreground opacity-50">Secondary Disabled Unchecked</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox variant="secondary" disabled checked />
              <span className="text-sm text-foreground opacity-50">Secondary Disabled Checked</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Indeterminate State</h3>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox checked="indeterminate" />
              <span className="text-sm text-foreground">Indeterminate</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox variant="secondary" checked="indeterminate" />
              <span className="text-sm text-foreground">Secondary Indeterminate</span>
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

export const Indeterminate: Story = {
  args: {
    checked: "indeterminate",
  },
  decorators: [ThemeSwitcherDecorator],
};

export const WithLabel: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    const [isAccepted, setIsAccepted] = useState(false);
    const id = useId();

    return (
      <div className="flex items-center space-x-2">
        <Checkbox id={id} checked={isAccepted} onCheckedChange={(checked) => setIsAccepted(checked === true)} />
        <Label htmlFor={id} className="text-sm text-foreground cursor-pointer">
          Accept terms and conditions
        </Label>
      </div>
    );
  },
};

export const WithLabelAndDescription: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const id = useId();

    return (
      <div className="flex items-start space-x-2">
        <Checkbox id={id} checked={isEnabled} onCheckedChange={(checked) => setIsEnabled(checked === true)} />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
            Enable notifications
          </Label>
          <p className="text-sm text-neutral-medium">Receive email notifications about your account activity.</p>
        </div>
      </div>
    );
  },
};

export const MultipleCheckboxes: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    const [preferences, setPreferences] = useState({
      marketing: false,
      updates: true,
      newsletter: false,
      security: true,
    });

    const handleChange = (key: keyof typeof preferences) => (checked: boolean | "indeterminate") => {
      setPreferences((prev) => ({ ...prev, [key]: checked === true }));
    };

    const marketingId = useId();
    const updatesId = useId();
    const newsletterId = useId();
    const securityId = useId();

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id={marketingId} checked={preferences.marketing} onCheckedChange={handleChange("marketing")} />
          <Label htmlFor={marketingId} className="text-sm font-medium text-foreground cursor-pointer">
            Marketing emails
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={updatesId}
            variant="secondary"
            checked={preferences.updates}
            onCheckedChange={handleChange("updates")}
          />
          <Label htmlFor={updatesId} className="text-sm font-medium text-foreground cursor-pointer">
            Product updates
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={newsletterId}
            checked={preferences.newsletter}
            onCheckedChange={handleChange("newsletter")}
          />
          <Label htmlFor={newsletterId} className="text-sm font-medium text-foreground cursor-pointer">
            Weekly newsletter
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={securityId}
            checked={preferences.security}
            onCheckedChange={handleChange("security")}
            disabled
          />
          <Label htmlFor={securityId} className="text-sm font-medium text-foreground opacity-50 cursor-not-allowed">
            Security alerts (Required)
          </Label>
        </div>
      </div>
    );
  },
};

export const SelectAllPattern: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    const [items, setItems] = useState({
      item1: false,
      item2: false,
      item3: false,
    });

    const allChecked = Object.values(items).every(Boolean);
    const someChecked = Object.values(items).some(Boolean);
    const selectAllState = allChecked ? true : someChecked ? "indeterminate" : false;

    const handleSelectAll = (checked: boolean | "indeterminate") => {
      const newValue = checked === true;
      setItems({
        item1: newValue,
        item2: newValue,
        item3: newValue,
      });
    };

    const handleItemChange = (key: keyof typeof items) => (checked: boolean | "indeterminate") => {
      setItems((prev) => ({ ...prev, [key]: checked === true }));
    };

    const selectAllId = useId();
    const item1Id = useId();
    const item2Id = useId();
    const item3Id = useId();

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-neutral-soft">
          <Checkbox id={selectAllId} checked={selectAllState} onCheckedChange={handleSelectAll} />
          <Label htmlFor={selectAllId} className="text-sm font-semibold text-foreground cursor-pointer">
            Select all items
          </Label>
        </div>

        <div className="pl-6 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id={item1Id} checked={items.item1} onCheckedChange={handleItemChange("item1")} />
            <Label htmlFor={item1Id} className="text-sm text-foreground cursor-pointer">
              Item 1
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id={item2Id} checked={items.item2} onCheckedChange={handleItemChange("item2")} />
            <Label htmlFor={item2Id} className="text-sm text-foreground cursor-pointer">
              Item 2
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id={item3Id} checked={items.item3} onCheckedChange={handleItemChange("item3")} />
            <Label htmlFor={item3Id} className="text-sm text-foreground cursor-pointer">
              Item 3
            </Label>
          </div>
        </div>
      </div>
    );
  },
};
