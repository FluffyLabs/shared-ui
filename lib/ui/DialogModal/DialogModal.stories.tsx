import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { useState } from "react";
import { ToggleDarkModeIcon } from "@/components";
import { Button } from "../Button";
import DialogModal from "./DialogModal";

const meta = {
  title: "UI/DialogModal",
  component: DialogModal,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DialogModal>;

export default meta;

type Story = StoryObj<typeof DialogModal>;

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
					consequat in, pretium a, enim.`;

export const Default: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => (
    <div className="bg-accent p-12 max-sm:p-6">
      <DialogModal>
        <DialogModal.Trigger>
          <Button size="sm">Open Modal</Button>
        </DialogModal.Trigger>
        <DialogModal.Content>
          <DialogModal.Title size="md" variant="brand">
            Modal Dialog Example
          </DialogModal.Title>
          <DialogModal.Description>{loremIpsum.slice(0, 24)}</DialogModal.Description>
          <DialogModal.Body>{loremIpsum}</DialogModal.Body>
          <DialogModal.Footer className="flex gap-2">
            <DialogModal.Close asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogModal.Close>
            <Button>Save Changes</Button>
          </DialogModal.Footer>
        </DialogModal.Content>
      </DialogModal>
    </div>
  ),
};

export const OpenCloseViaProp: Story = {
  decorators: [ThemeSwitcherDecorator],
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="bg-accent p-12 max-sm:p-6">
        <Button onClick={() => setOpen(!open)}>Toggle modal</Button>
        <DialogModal open={open} onOpenChange={setOpen}>
          <DialogModal.Content>
            <DialogModal.Title size="md" variant="brand">
              Modal Dialog Example
            </DialogModal.Title>
            <DialogModal.Description>{loremIpsum.slice(0, 24)}</DialogModal.Description>
            <DialogModal.Body>{loremIpsum}</DialogModal.Body>
            <DialogModal.Footer className="flex gap-2">
              <DialogModal.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogModal.Close>
              <Button>Save Changes</Button>
            </DialogModal.Footer>
          </DialogModal.Content>
        </DialogModal>
      </div>
    );
  },
};
