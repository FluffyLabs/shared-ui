import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleDarkModeIcon } from "@/components/DarkMode";
import { AuthFlow } from "./AuthFlow";
import { MockSupabaseProvider } from "./StorybookProvider";

const meta = {
  title: "Supabase/AuthFlow",
  component: AuthFlow,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <MockSupabaseProvider>
        <div className="bg-card p-8 rounded-lg border w-96">
          <div className="flex justify-end mb-4">
            <ToggleDarkModeIcon />
          </div>
          <Story />
        </div>
      </MockSupabaseProvider>
    ),
  ],
} satisfies Meta<typeof AuthFlow>;

export default meta;

type Story = StoryObj<typeof AuthFlow>;

export const Login: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The default login tab. Submitting will show an error since there is no real Supabase backend connected.",
      },
    },
  },
};

export const WithClassName: Story = {
  args: {
    className: "p-4 border border-dashed border-muted-foreground rounded",
  },
  parameters: {
    docs: {
      description: {
        story: "AuthFlow with custom className applied.",
      },
    },
  },
};
