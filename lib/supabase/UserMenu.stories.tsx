import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "@/components/Header";
import Toolname from "@/assets/tool-name.svg";
import { UserMenu } from "./UserMenu";
import { MockSupabaseProvider } from "./StorybookProvider";

const meta = {
  title: "Supabase/UserMenu",
  component: UserMenu,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof UserMenu>;

export default meta;

type Story = StoryObj<typeof UserMenu>;

export const LoggedOut: Story = {
  decorators: [
    (Story) => (
      <MockSupabaseProvider user={null}>
        <div className="bg-[#242424] p-4 rounded-lg flex items-center gap-4">
          <span className="text-gray-300 text-sm">Header end slot:</span>
          <Story />
        </div>
      </MockSupabaseProvider>
    ),
  ],
  args: {
    onLoginClick: () => alert("Navigate to login page"),
    onSettingsClick: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'When no user is logged in, shows a "Login" button. Pass `onLoginClick` to handle navigation.',
      },
    },
  },
};

export const LoggedIn: Story = {
  decorators: [
    (Story) => (
      <MockSupabaseProvider user={{ email: "alice@fluffylabs.dev" }}>
        <div className="bg-[#242424] p-4 rounded-lg flex items-center gap-4">
          <span className="text-gray-300 text-sm">Header end slot:</span>
          <Story />
        </div>
      </MockSupabaseProvider>
    ),
  ],
  args: {
    onSettingsClick: () => alert("Navigate to settings page"),
  },
  parameters: {
    docs: {
      description: {
        story: "When logged in, shows the user email and a dropdown with settings and sign out.",
      },
    },
  },
};

export const LoggedInWithoutSettings: Story = {
  decorators: [
    (Story) => (
      <MockSupabaseProvider user={{ email: "bob@fluffylabs.dev" }}>
        <div className="bg-[#242424] p-4 rounded-lg flex items-center gap-4">
          <span className="text-gray-300 text-sm">Header end slot:</span>
          <Story />
        </div>
      </MockSupabaseProvider>
    ),
  ],
  args: {
    onSettingsClick: undefined,
    onLoginClick: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: "Without `onSettingsClick`, the settings menu item is hidden. Only sign out is shown.",
      },
    },
  },
};

export const Compact: Story = {
  decorators: [
    (Story) => (
      <MockSupabaseProvider user={{ email: "alice@fluffylabs.dev" }}>
        <div className="bg-[#242424] p-4 rounded-lg flex items-center gap-4">
          <span className="text-gray-300 text-sm">Header end slot:</span>
          <Story />
        </div>
      </MockSupabaseProvider>
    ),
  ],
  args: {
    compact: true,
    onSettingsClick: () => alert("Navigate to settings page"),
  },
  parameters: {
    docs: {
      description: {
        story: 'With `compact`, only the username (before "@") is shown in the button.',
      },
    },
  },
};

export const InHeader: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "UserMenu placed in the Header's `endSlot`, showing realistic integration.",
      },
    },
  },
  decorators: [
    (Story) => (
      <MockSupabaseProvider user={{ email: "alice@fluffylabs.dev" }}>
        <Story />
      </MockSupabaseProvider>
    ),
  ],
  render: (args) => <Header toolNameSrc={Toolname} endSlot={<UserMenu {...args} />} />,
  args: {
    onSettingsClick: () => alert("Navigate to settings"),
    onLoginClick: () => alert("Navigate to login"),
  },
};

export const InHeaderLoggedOut: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "UserMenu in the Header when no user is logged in.",
      },
    },
  },
  decorators: [
    (Story) => (
      <MockSupabaseProvider user={null}>
        <Story />
      </MockSupabaseProvider>
    ),
  ],
  render: (args) => <Header toolNameSrc={Toolname} endSlot={<UserMenu {...args} />} />,
  args: {
    onLoginClick: () => alert("Navigate to login"),
    onSettingsClick: undefined,
  },
};
