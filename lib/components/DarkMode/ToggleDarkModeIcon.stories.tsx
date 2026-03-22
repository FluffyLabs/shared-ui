import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleDarkModeIcon } from ".";

const meta = {
  title: "Components/ToggleDarkModeIcon",
  component: ToggleDarkModeIcon,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {},
} satisfies Meta<typeof ToggleDarkModeIcon>;

export default meta;

type Story = StoryObj<typeof ToggleDarkModeIcon>;

export const DefaultToggleDarkModeIcon: Story = {
  args: {},
};
