import type { Meta, StoryObj } from "@storybook/react";
import { ToggleDarkModeIcon } from "../DarkMode";

// Compact color swatch component using Tailwind classes
const ColorSwatch = ({ name, className, description }: { name: string; className: string; description?: string }) => (
  <div className="flex flex-col items-center gap-1 p-2">
    <div className={`w-12 h-12 rounded border border-border shadow-sm ${className}`} />
    <div className="text-center">
      <div className="text-xs font-medium text-foreground">{name}</div>
      <div className="text-xs text-muted-foreground font-mono">{className}</div>
      {description && <div className="text-xs text-muted-foreground opacity-75">{description}</div>}
    </div>
  </div>
);

const ThemeSwitcherDecorator = (Story: React.FC) => (
  <div className="bg-background">
    <div className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg p-2 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">Theme:</span>
        <ToggleDarkModeIcon />
      </div>
    </div>
    <Story />
  </div>
);

export const SemanticColors: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-6 bg-background">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-title-foreground mb-6">Semantic Colors</h1>
        <div>
          <h2 className="text-xl font-bold text-title-foreground mb-2">Branded Colors</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 bg-card border border-border rounded-lg p-4">
            <ColorSwatch name="Brand Primary" className="bg-brand-primary" />
            <ColorSwatch name="Brand Secondary" className="bg-brand-secondary" />
            <ColorSwatch name="Brand Tertiary" className="bg-brand-tertiary" />
            <ColorSwatch name="Brand Fourth" className="bg-brand-fourth" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-title-foreground mb-2">Netural Colors</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 bg-card border border-border rounded-lg p-4">
            <ColorSwatch name="Netural strong" className="bg-neutral-strong" />
            <ColorSwatch name="Netural medium" className="bg-neutral-medium" />
            <ColorSwatch name="Netural soft" className="bg-neutral-soft" />
          </div>
        </div>
      </div>
    </div>
  ),
};

const meta = {
  title: "Design System/Colors",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<React.FC>;

export default meta;

type Story = StoryObj<React.FC>;

// Individual color group stories for easier navigation
export const FixedBrandColors: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-title-foreground mb-6">Fixed Brand Colors</h1>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 bg-card border border-border rounded-lg p-4">
          <ColorSwatch name="Brand" className="bg-brand" />
          <ColorSwatch name="Light" className="bg-brand-light" />
          <ColorSwatch name="Very Light" className="bg-brand-very-light" />
          <ColorSwatch name="Lightest" className="bg-brand-lightest" />
          <ColorSwatch name="Dark" className="bg-brand-dark" />
          <ColorSwatch name="Very Dark" className="bg-brand-very-dark" />
          <ColorSwatch name="Darkest" className="bg-brand-darkest" />
        </div>
      </div>
    </div>
  ),
};
