import type { Meta, StoryObj } from "@storybook/react";
import { HelpCircleIcon, InfoIcon, SettingsIcon, UserIcon } from "lucide-react";

import { ToggleDarkModeIcon } from "../../components/DarkMode";
import { Button } from "../Button/button";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

const meta = {
  title: "UI/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "This component is a reimplementation of Radix UI Popover: https://www.radix-ui.com/primitives/docs/components/popover please refer to it for detailed API docs.",
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof Popover>;

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
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="primary" intent="primary">
          Open Popover
        </Button>
      </PopoverTrigger>
      <PopoverContent>This is the simplest tooltip possible</PopoverContent>
    </Popover>
  ),
};

export const InteractiveWithAllSizes: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="flex gap-4">
      <div className="flex gap-4 items-center">
        <div className="text-foreground text-sm">Small</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="primary" intent="primary">
              Open Popover
            </Button>
          </PopoverTrigger>
          <PopoverContent size="small">This is the simplest tooltip possible</PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-4 items-center">
        <div className="text-foreground text-sm">Medium - default</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="primary" intent="primary">
              Open Popover
            </Button>
          </PopoverTrigger>
          <PopoverContent>This is the simplest tooltip possible</PopoverContent>
        </Popover>
      </div>
      <div className="flex gap-4 items-center">
        <div className="text-foreground text-sm">Small</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="primary" intent="primary">
              Open Popover
            </Button>
          </PopoverTrigger>
          <PopoverContent size="large">This is the simplest tooltip possible</PopoverContent>
        </Popover>
      </div>
    </div>
  ),
};

export const WithDisabledButton: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="flex gap-4 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="primary" intent="primary" disabled>
            Disabled Trigger
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">This won&apos;t show</h4>
            <p className="text-sm text-muted-foreground">
              The popover won&apos;t open because the trigger is disabled.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <span className="text-sm text-muted-foreground">← Disabled button won&apos;t trigger</span>
    </div>
  ),
};

export const WithText: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="space-y-4">
      <Popover>
        <PopoverTrigger asChild>
          <span className="text-primary hover:text-primary/80 cursor-pointer underline">
            Click this text to open popover
          </span>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Text Trigger</h4>
            <p className="text-sm text-muted-foreground">
              You can use any text element as a popover trigger by wrapping it with PopoverTrigger.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Need help? Click here
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Help Information</h4>
            <p className="text-sm text-muted-foreground">
              Here&apos;s some helpful information that appears when you click the help text.
            </p>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="primary" intent="primary">
                Got it
              </Button>
              <Button size="sm" variant="secondary" intent="neutralMedium">
                Learn more
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const WithIcon: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="flex gap-6 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost" intent="neutralMedium">
            <InfoIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Information</h4>
            <p className="text-sm text-muted-foreground">This popover is triggered by clicking the info icon.</p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="secondary" intent="primary">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-3">
            <h4 className="font-medium leading-none">Settings</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Enable notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Auto-save changes</span>
              </label>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="p-0 border-0 bg-transparent">
            <HelpCircleIcon className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Need Help?</h4>
            <p className="text-sm text-muted-foreground">Click on icons to get contextual help and information.</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const AllPositions: Story = {
  parameters: {
    layout: "fullscreen",
  },
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-8 space-y-8">
      <h3 className="text-lg font-semibold text-foreground">Different Positions</h3>

      <div className="grid grid-cols-3 gap-8 place-items-center min-h-[300px]">
        {/* Top row */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" intent="primary">
              Top Start
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start">
            <p className="text-sm">Positioned at top-start</p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" intent="primary">
              Top Center
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="center">
            <p className="text-sm">Positioned at top-center</p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" intent="primary">
              Top End
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="end">
            <p className="text-sm">Positioned at top-end</p>
          </PopoverContent>
        </Popover>

        {/* Middle row */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" intent="primary">
              Left
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left">
            <p className="text-sm">Positioned to the left</p>
          </PopoverContent>
        </Popover>

        <div className="text-center text-muted-foreground">
          <p className="text-sm">Center Reference</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" intent="primary">
              Right
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right">
            <p className="text-sm">Positioned to the right</p>
          </PopoverContent>
        </Popover>

        {/* Bottom row */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" intent="primary">
              Bottom Start
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="start">
            <p className="text-sm">Positioned at bottom-start</p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" intent="primary">
              Bottom Center
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="center">
            <p className="text-sm">Positioned at bottom-center</p>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" intent="primary">
              Bottom End
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end">
            <p className="text-sm">Positioned at bottom-end</p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  ),
};

export const ComplexContent: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="flex gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="primary" intent="primary">
            User Menu
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            </div>

            <div className="space-y-1">
              <Button type="button" className="w-full justify-start" variant="ghost">
                Profile Settings
              </Button>
              <Button type="button" className="w-full justify-start" variant="ghost">
                Billing
              </Button>
              <Button type="button" className="w-full justify-start" variant="ghost">
                Team Settings
              </Button>
            </div>

            <div className="border-t pt-2">
              <Button type="button" intent="destructive" className="w-full justify-start" variant="ghost">
                Sign Out
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" intent="primary">
            Quick Actions
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-3">
            <h4 className="font-medium leading-none">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="ghost" intent="primary" className="justify-start">
                <InfoIcon className="h-4 w-4 mr-2" />
                Info
              </Button>
              <Button size="sm" variant="ghost" intent="primary" className="justify-start">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" variant="ghost" intent="primary" className="justify-start">
                <HelpCircleIcon className="h-4 w-4 mr-2" />
                Help
              </Button>
              <Button size="sm" variant="ghost" intent="primary" className="justify-start">
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
