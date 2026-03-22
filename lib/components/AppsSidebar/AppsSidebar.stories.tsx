import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppsSidebar } from "./index";

const meta = {
  title: "Components/AppsSidebar",
  component: AppsSidebar,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {},
} satisfies Meta<typeof AppsSidebar>;

export default meta;

type Story = StoryObj<typeof AppsSidebar>;

export const DefaultAppsSidebar: Story = {
  args: {},
};
