import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown } from "lucide-react";
import { ToggleDarkModeIcon } from "../../components/DarkMode";
import { Button } from "../Button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../DropdownMenu/dropdown-menu";
import { ButtonGroup } from "./ButtonGroup";

const meta = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

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
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Horizontal Button Group</h3>
        <ButtonGroup>
          <Button variant="secondary">First</Button>
          <Button variant="secondary">Second</Button>
          <Button variant="secondary">Third</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                Options <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
              <DropdownMenuItem>Option 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Vertical Button Group</h3>
        <ButtonGroup orientation="vertical">
          <Button variant="secondary">First</Button>
          <Button variant="secondary">Second</Button>
          <Button variant="secondary">Third</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                Options <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
              <DropdownMenuItem>Option 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Different Variants</h3>
        <div className="flex flex-col gap-4">
          <ButtonGroup>
            <Button variant="primary">Outline Brand</Button>
            <Button variant="primary">Outline Brand</Button>
            <Button variant="primary">Outline Brand</Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="primary" intent="neutralStrong">
              Secondary
            </Button>
            <Button variant="primary" intent="neutralStrong">
              Secondary
            </Button>
            <Button variant="primary" intent="neutralStrong">
              Secondary
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="secondary">Cut</Button>
            <Button variant="secondary">Copy</Button>
            <Button variant="secondary">Paste</Button>
          </ButtonGroup>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Mixed Sizes</h3>
        <div className="flex flex-col gap-4">
          <ButtonGroup>
            <Button variant="secondary" size="sm">
              Small
            </Button>
            <Button variant="secondary" size="sm">
              Small
            </Button>
            <Button variant="secondary" size="sm">
              Small
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="secondary" size="default">
              Default
            </Button>
            <Button variant="secondary" size="default">
              Default
            </Button>
            <Button variant="secondary" size="default">
              Default
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button variant="secondary" size="lg">
              Large
            </Button>
            <Button variant="secondary" size="lg">
              Large
            </Button>
            <Button variant="secondary" size="lg">
              Large
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  ),
};

export const Horizontal: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">First</Button>
      <Button variant="secondary">Second</Button>
      <Button variant="secondary">Third</Button>
      <Button variant="secondary">Fourth</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  decorators: [ThemeSwitcherDecorator],
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">First</Button>
      <Button variant="secondary">Second</Button>
      <Button variant="secondary">Third</Button>
      <Button variant="secondary">Fourth</Button>
    </ButtonGroup>
  ),
};

export const WithDropdown: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">Action</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
};

export const DisabledStates: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="secondary">Enabled</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="secondary">Enabled</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="secondary">Enabled</Button>
      </ButtonGroup>
    </div>
  ),
};
