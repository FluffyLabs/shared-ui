import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders textarea with default props", () => {
    render(<Textarea />);

    const textareaElement = screen.getByRole("textbox");
    expect(textareaElement).toBeInTheDocument();
    expect(textareaElement.tagName).toBe("TEXTAREA");
  });

  it("renders with placeholder", () => {
    render(<Textarea placeholder="Enter text here" />);

    const textareaElement = screen.getByPlaceholderText("Enter text here");
    expect(textareaElement).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<Textarea className="custom-class" />);

    const textareaElement = screen.getByRole("textbox");
    expect(textareaElement).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Textarea ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
