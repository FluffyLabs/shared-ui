import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleDarkModeIcon } from "@/components/DarkMode";
import { Settings } from "./Settings";

const meta = {
  title: "Supabase/Settings",
  component: Settings,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="bg-card p-4 rounded-lg border w-[500px]">
        <div className="flex justify-end mb-2">
          <ToggleDarkModeIcon />
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Settings>;

export default meta;

type Story = StoryObj<typeof Settings>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Settings panel with theme selector. Uses the existing DarkMode toggle (light/dark/auto).",
      },
    },
  },
};

export const WithClassName: Story = {
  args: {
    className: "bg-muted rounded-lg",
  },
};
