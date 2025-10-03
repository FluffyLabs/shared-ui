import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { useState } from "react";
import { ToggleDarkModeIcon } from "@/components";
import { Dialog } from "./Dialog";

const meta = {
	title: "UI/Dialog",
	component: Dialog,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		isOpen: { control: "boolean" },
		title: { control: "text" },
		children: { control: "text" },
	},
	render: (args) => {
		const [isOpen, setIsOpen] = useState(false);

		const handleClose = () => setIsOpen(false);

		return (
			<div>
				<Dialog isOpen={isOpen} onClose={handleClose} title={args.title}>
					{args.children}
				</Dialog>
			</div>
		);
	},
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof Dialog>;

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

export const Default: Story = {
	decorators: [ThemeSwitcherDecorator],
	args: {
		title: "Dialog Title",
		children: "This is the dialog content.",
	},
};

export const HelloWorld: Story = {
	decorators: [ThemeSwitcherDecorator],
	args: {
		title: "Hello World",
		children: "Hello, world!",
	},
};
