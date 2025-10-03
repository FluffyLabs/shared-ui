import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { ToggleDarkModeIcon } from "@/components";
import { Button } from "../Button";
import Dialog from "./Dialog";

const meta = {
	title: "UI/Dialog",
	component: Dialog,
	parameters: {
		layout: "fullscreen",
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

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
					risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec,
					ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula
					massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci
					nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl
					sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae,
					consequat in, pretium a, enim. Pellentesque congue. Ut in risus
					volutpat libero pharetra tempor. Cras vestibulum bibendum augue.
					Praesent egestas leo in pede. Praesent blandit odio eu enim.
					Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum
					primis in faucibus orci luctus et ultrices posuere cubilia Curae;
					Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum.
					Maecenas adipiscing ante non diam sodales hendrerit.`;

export const Default: Story = {
	decorators: [ThemeSwitcherDecorator],
	render: () => (
		<div className="bg-accent p-12 max-sm:p-6">
			<Dialog>
				<Dialog.Header>
					Start with an example program or upload your file
				</Dialog.Header>
				<Dialog.Content>{loremIpsum}</Dialog.Content>
				<Dialog.Footer>
					<Button variant="secondary">Secondary</Button>
				</Dialog.Footer>
			</Dialog>
		</div>
	),
};

export const DifferentHeaderSizes: Story = {
	decorators: [ThemeSwitcherDecorator],
	render: () => (
		<div className="bg-accent p-12 max-sm:p-6 flex flex-col gap-12">
			<Dialog>
				<Dialog.Header size="md" variant="normal">
					Medium & normal variant
				</Dialog.Header>
				<Dialog.Content>{loremIpsum.slice(0, 23)}</Dialog.Content>
			</Dialog>
			<Dialog>
				<Dialog.Header size="md" variant="brand">
					Medium & branded variant
				</Dialog.Header>
				<Dialog.Content>{loremIpsum.slice(0, 23)}</Dialog.Content>
			</Dialog>
			<Dialog>
				<Dialog.Header size="sm" variant="normal">
					Small & normal variant
				</Dialog.Header>
				<Dialog.Content>{loremIpsum.slice(0, 23)}</Dialog.Content>
			</Dialog>
			<Dialog>
				<Dialog.Header size="sm" variant="brand">
					Small & branded variant
				</Dialog.Header>
				<Dialog.Content>{loremIpsum.slice(0, 23)}</Dialog.Content>
			</Dialog>
		</div>
	),
};

export const RadixSlotExample: Story = {
	decorators: [ThemeSwitcherDecorator],
	name: "Mix of Slot and className prop usage",
	render: () => (
		<div className="bg-accent p-12 max-sm:p-6">
			<Dialog asChild>
				<div className="rounded-none">
					<Dialog.Header className="rounded-none">
						Start with an example program or upload your file
					</Dialog.Header>
					<Dialog.Content asChild>
						<div className="text-red-900">{loremIpsum}</div>
					</Dialog.Content>
					<Dialog.Footer>
						<Button variant="secondary">Secondary</Button>
					</Dialog.Footer>
				</div>
			</Dialog>
		</div>
	),
};

export const NoFooterSeparator: Story = {
	decorators: [ThemeSwitcherDecorator],
	render: () => (
		<div className="bg-accent p-12 max-sm:p-6">
			<Dialog>
				<Dialog.Header>
					Start with an example program or upload your file
				</Dialog.Header>
				<Dialog.Content>{loremIpsum}</Dialog.Content>
				<Dialog.Footer noSeparator>
					<Button variant="secondary">Secondary</Button>
				</Dialog.Footer>
			</Dialog>
		</div>
	),
};

export const NoHeader: Story = {
	decorators: [ThemeSwitcherDecorator],
	render: () => (
		<div className="bg-accent p-12 max-sm:p-6">
			<Dialog>
				<Dialog.Content>{loremIpsum}</Dialog.Content>
				<Dialog.Footer>
					<Button variant="secondary">Secondary</Button>
				</Dialog.Footer>
			</Dialog>
		</div>
	),
};
