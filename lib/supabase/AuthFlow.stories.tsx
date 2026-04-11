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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "The default email entry screen. Users enter their email and receive a magic link.",
      },
    },
  },
};

export const WithRedirectTo: Story = {
  args: {
    redirectTo: "http://localhost:6006/auth/callback",
  },
  parameters: {
    docs: {
      description: {
        story: "AuthFlow with a redirectTo URL configured for the magic link.",
      },
    },
  },
};
