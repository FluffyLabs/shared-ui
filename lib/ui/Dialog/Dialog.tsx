import type React from "react";

export interface DialogProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ children }) => {
	return <div>{children}</div>;
};
