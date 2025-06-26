import type { Meta, StoryObj } from "@storybook/react";

import { Header } from "./index";
import Toolname from "@/assets/tool-name.svg";
import LongNameLogo from "@/assets/tool-long-name-logo.svg";

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {},
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof Header>;

export const DefaultHeader: Story = {
  args: {
    endSlot: <div className="text-gray-100 mr-2">End slot content</div>,
    ghRepoName: "graypaper-reader",
    toolNameSrc: Toolname,
  },
};

export const MinimalHeader: Story = {
  args: {
    ghRepoName: "fork-shared-ui",
    toolNameSrc: Toolname,
    keepNameWhenSmall: true,
  },
  parameters: {
    docs: {
      description: {
        story: `This example demonstrates the Header component with:
- **keepNameWhenSmall**: true - Keeps the tool name visible on small screens
`,
      },
    },
  },
};

export const HeaderWithCustomEndSlot: Story = {
  args: {
    endSlot: (
      <div className="flex items-center gap-2">
        <button type="button" className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
          Sign In
        </button>
        <span className="text-gray-400">|</span>
        <span className="text-gray-200">v1.0.0</span>
      </div>
    ),
    ghRepoName: "my-awesome-project",
    toolNameSrc: Toolname,
    keepNameWhenSmall: false,
  },
  parameters: {
    docs: {
      description: {
        story: `This example shows the Header component with all props configured:
- **endSlot**: Custom JSX content (Sign In button and version info)
- **keepNameWhenSmall**: true - Keeps the tool name visible on small screens
`,
      },
    },
  },
};

export const HeaderWithCustomEndSlotAndKeepNameWhenSmall: Story = {
  args: {
    endSlot: (
      <div className="flex items-center gap-2">
        <button type="button" className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
          Sign In
        </button>
        <span className="text-gray-400">|</span>
        <span className="text-gray-200">v1.0.0</span>
      </div>
    ),
    ghRepoName: "my-awesome-project",
    toolNameSrc: Toolname,
    keepNameWhenSmall: true,
  },
  parameters: {
    docs: {
      description: {
        story: `This example shows \`endSlot\` hidden when \`keepNameWhenSmall\` is true:
- **endSlot**: Custom JSX content (Sign In button and version info)
- **keepNameWhenSmall**: true - Keeps the tool name visible on small screens
`,
      },
    },
  },
};

export const HeaderWithLongLongoCustomEndSlot: Story = {
  args: {
    endSlot: (
      <div className="flex items-center gap-2">
        <button type="button" className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
          Sign In
        </button>
        <span className="text-gray-400">|</span>
        <span className="text-gray-200">v1.0.0</span>
      </div>
    ),
    ghRepoName: "my-awesome-project",
    toolNameSrc: LongNameLogo,
    keepNameWhenSmall: false,
  },
  parameters: {
    docs: {
      description: {
        story: `This example shows the Header component with all props configured:
- **endSlot**: Custom JSX content (Sign In button and version info)
- **keepNameWhenSmall**: true - Keeps the tool name visible on small screens
`,
      },
    },
  },
};

export const HeaderWithLongLogoCustomEndSlotAndKeepNameWhenSmall: Story = {
  args: {
    endSlot: (
      <div className="flex items-center gap-2">
        <button type="button" className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
          Sign In
        </button>
        <span className="text-gray-400">|</span>
        <span className="text-gray-200">v1.0.0</span>
      </div>
    ),
    ghRepoName: "my-awesome-project",
    toolNameSrc: LongNameLogo,
    keepNameWhenSmall: true,
  },
  parameters: {
    docs: {
      description: {
        story: `This example shows \`endSlot\` hidden when \`keepNameWhenSmall\` is true:
- **endSlot**: Custom JSX content (Sign In button and version info)
- **keepNameWhenSmall**: true - Keeps the tool name visible on small screens
`,
      },
    },
  },
};
