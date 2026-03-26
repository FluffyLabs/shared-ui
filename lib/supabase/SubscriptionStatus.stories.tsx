import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleDarkModeIcon } from "@/components/DarkMode";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { MockSupabaseProvider } from "./StorybookProvider";

const meta = {
  title: "Supabase/SubscriptionStatus",
  component: SubscriptionStatus,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SubscriptionStatus>;

export default meta;

type Story = StoryObj<typeof SubscriptionStatus>;

export const FreeUser: Story = {
  decorators: [
    (Story) => (
      <MockSupabaseProvider user={{ email: "alice@fluffylabs.dev" }}>
        <div className="bg-card p-6 rounded-lg border w-[450px]">
          <div className="flex justify-end mb-4">
            <ToggleDarkModeIcon />
          </div>
          <Story />
        </div>
      </MockSupabaseProvider>
    ),
  ],
  args: {
    onCheckout: () => alert("Redirect to Stripe Checkout"),
  },
  parameters: {
    docs: {
      description: {
        story: "Shows free plan badge with upgrade button. For use in the Settings page.",
      },
    },
  },
};
