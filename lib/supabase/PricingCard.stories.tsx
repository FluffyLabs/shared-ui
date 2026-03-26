import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleDarkModeIcon } from "@/components/DarkMode";
import { PricingCard } from "./PricingCard";
import { MockSupabaseProvider } from "./StorybookProvider";

const meta = {
  title: "Supabase/PricingCard",
  component: PricingCard,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof PricingCard>;

export default meta;

type Story = StoryObj<typeof PricingCard>;

export const FreeUser: Story = {
  decorators: [
    (Story) => (
      <MockSupabaseProvider user={{ email: "alice@fluffylabs.dev" }}>
        <div className="bg-card p-8 rounded-lg">
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
        story: "Default pricing card shown to free users. Clicking upgrade triggers the `onCheckout` callback.",
      },
    },
  },
};

export const CustomPlan: Story = {
  decorators: [
    (Story) => (
      <MockSupabaseProvider user={{ email: "alice@fluffylabs.dev" }}>
        <div className="bg-card p-8 rounded-lg">
          <Story />
        </div>
      </MockSupabaseProvider>
    ),
  ],
  args: {
    planName: "Team",
    price: "$15",
    period: "/month",
    features: ["Everything in Pro", "5 team members", "Shared workspaces", "Admin dashboard"],
    onCheckout: () => alert("Redirect to Stripe Checkout"),
  },
  parameters: {
    docs: {
      description: {
        story: "PricingCard with custom plan name, price, and features.",
      },
    },
  },
};
