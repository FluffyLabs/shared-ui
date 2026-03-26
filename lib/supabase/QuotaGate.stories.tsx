import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleDarkModeIcon } from "@/components/DarkMode";
import { QuotaGate } from "./QuotaGate";
import { MockSupabaseProvider } from "./StorybookProvider";

const meta = {
  title: "Supabase/QuotaGate",
  component: QuotaGate,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof QuotaGate>;

export default meta;

type Story = StoryObj<typeof QuotaGate>;

const SampleContent = () => (
  <div className="rounded-lg border bg-card p-6">
    <h3 className="text-foreground font-medium">Premium Feature</h3>
    <p className="text-sm text-muted-foreground mt-1">This content is gated behind the quota system.</p>
  </div>
);

export const UnderLimit: Story = {
  decorators: [
    (Story) => (
      <MockSupabaseProvider user={{ email: "alice@fluffylabs.dev" }}>
        <div className="bg-card p-8 rounded-lg w-[500px]">
          <div className="flex justify-end mb-4">
            <ToggleDarkModeIcon />
          </div>
          <Story />
        </div>
      </MockSupabaseProvider>
    ),
  ],
  args: {
    action: "decode",
    freeLimit: 50,
    onCheckout: () => alert("Redirect to Stripe Checkout"),
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When the user is under their free limit, content is shown with a usage progress bar. Note: in Storybook with the mock provider, usage is always 0.",
      },
    },
  },
};
