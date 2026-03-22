import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleDarkMode } from ".";

const meta = {
  title: "Components/ToggleDarkMode",
  component: ToggleDarkMode,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {},
} satisfies Meta<typeof ToggleDarkMode>;

export default meta;

type Story = StoryObj<typeof ToggleDarkMode>;

export const DefaultToggleDarkMode: Story = {
  args: {},
};

export const ToggleDarkModeIcon: Story = {
  args: {},
};
