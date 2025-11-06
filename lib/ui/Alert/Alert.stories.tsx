import type { Meta, StoryObj } from "@storybook/react";
import { ToggleDarkModeIcon } from "../../components/DarkMode";
import { Alert } from "./Alert";

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    intent: {
      control: { type: "select" },
      options: ["primary", "neutral", "destructive", "success", "warning"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof Alert>;

const ThemeSwitcherDecorator = (Story: React.FC) => (
  <div className="p-4 bg-card">
    <div className="flex justify-between items-center mb-4 gap-2">
      <h3 className="text-md font-semibold text-foreground">Theme Switcher</h3>
      <ToggleDarkModeIcon />
    </div>
    <div className="flex flex-col gap-2 items-start">
      <h2 className="text-lg text-foreground">Story</h2>
      <Story />
    </div>
  </div>
);

export const AllIntents: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-4 bg-card">
      <div className="flex flex-col gap-4 w-96">
        <h3 className="text-lg font-semibold text-foreground">All Intent Variations</h3>

        <Alert intent="primary">
          <Alert.Title>Primary Alert</Alert.Title>
          <Alert.Text>This uses the primary brand color for important informational messages.</Alert.Text>
        </Alert>

        <Alert intent="neutral">
          <Alert.Title>Neutral Alert</Alert.Title>
          <Alert.Text>This is the default neutral style, perfect for general information.</Alert.Text>
        </Alert>

        <Alert intent="destructive">
          <Alert.Title>Destructive Alert</Alert.Title>
          <Alert.Text>This indicates errors or destructive actions that require attention.</Alert.Text>
        </Alert>

        <Alert intent="success">
          <Alert.Title>Success Alert</Alert.Title>
          <Alert.Text>This confirms successful operations or positive outcomes.</Alert.Text>
        </Alert>

        <Alert intent="warning">
          <Alert.Title>Warning Alert</Alert.Title>
          <Alert.Text>This warns users about potential issues or important notices.</Alert.Text>
        </Alert>
      </div>
    </div>
  ),
};

export const DifferentLayouts: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-4 bg-card">
      <div className="flex flex-col gap-4 w-96">
        <h3 className="text-lg font-semibold text-foreground mb-2">Layout Variations</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-md font-medium text-foreground mb-2">With Title and Text</h4>
            <Alert intent="primary">
              <Alert.Title>Complete Alert</Alert.Title>
              <Alert.Text>This alert contains both a title and text for full context.</Alert.Text>
            </Alert>
          </div>

          <div>
            <h4 className="text-md font-medium text-foreground mb-2">Text Only</h4>
            <Alert intent="success">
              <Alert.Text>Simple success message without a title for brief notifications.</Alert.Text>
            </Alert>
          </div>

          <div>
            <h4 className="text-md font-medium text-foreground mb-2">With Custom Styling</h4>
            <Alert intent="warning" className="shadow-lg border-2">
              <Alert.Title>Enhanced Alert</Alert.Title>
              <Alert.Text>This alert has custom styling with shadow and thicker border.</Alert.Text>
            </Alert>
          </div>

          <div>
            <h4 className="text-md font-medium text-foreground mb-2">Complex Content</h4>
            <Alert intent="neutral">
              <Alert.Title>System Update</Alert.Title>
              <Alert.Text>A new version is available with the following improvements:</Alert.Text>
              <Alert.Text className="mt-2">
                • Performance enhancements
                <br />
                • Bug fixes
                <br />• New features
              </Alert.Text>
              <Alert.Text className="mt-2 font-medium">Update will be installed automatically at 3:00 AM.</Alert.Text>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const WithoutTitle: Story = {
  args: {
    intent: "neutral",
    children: (
      <Alert.Text>This is a simple alert message without a title. It can be used for brief notifications.</Alert.Text>
    ),
  },
  decorators: [ThemeSwitcherDecorator],
};

export const WithMultipleParagraphs: Story = {
  args: {
    intent: "primary",
    children: (
      <>
        <Alert.Title>Important Information</Alert.Title>
        <Alert.Text>This is the first paragraph of the alert description providing the main information.</Alert.Text>
        <Alert.Text className="mt-2">
          This is a second paragraph with additional details. You can compose multiple text elements for more complex
          content.
        </Alert.Text>
      </>
    ),
  },
  decorators: [ThemeSwitcherDecorator],
};

export const RealWorldExamples: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-4 bg-card">
      <div className="flex flex-col gap-4 w-96">
        <h3 className="text-lg font-semibold text-foreground mb-2">Real-world Use Cases</h3>

        <Alert intent="success">
          <Alert.Title>Payment Successful</Alert.Title>
          <Alert.Text>Your payment of $99.00 has been processed successfully. Receipt #12345</Alert.Text>
        </Alert>

        <Alert intent="destructive">
          <Alert.Title>Connection Error</Alert.Title>
          <Alert.Text>Unable to connect to the server. Please check your internet connection and try again.</Alert.Text>
        </Alert>

        <Alert intent="warning">
          <Alert.Title>Storage Almost Full</Alert.Title>
          <Alert.Text>
            You have used 90% of your storage quota. Consider upgrading your plan or deleting old files.
          </Alert.Text>
        </Alert>

        <Alert intent="primary">
          <Alert.Title>New Feature Available</Alert.Title>
          <Alert.Text>Try our new collaboration tools to work more efficiently with your team.</Alert.Text>
        </Alert>

        <Alert intent="neutral">
          <Alert.Text>Your changes are saved automatically every 30 seconds.</Alert.Text>
        </Alert>
      </div>
    </div>
  ),
};
