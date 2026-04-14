import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PasswordUpdate } from "./PasswordUpdate";
import { MockSupabaseProvider } from "./StorybookProvider";

describe("PasswordUpdate", () => {
  it("renders nothing when no user is logged in", () => {
    const { container } = render(
      <MockSupabaseProvider>
        <PasswordUpdate />
      </MockSupabaseProvider>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders password form when user is logged in", () => {
    render(
      <MockSupabaseProvider user={{ email: "test@example.com" }}>
        <PasswordUpdate />
      </MockSupabaseProvider>,
    );

    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm new password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /set password/i })).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(
      <MockSupabaseProvider user={{ email: "test@example.com" }}>
        <PasswordUpdate />
      </MockSupabaseProvider>,
    );

    await user.type(screen.getByPlaceholderText("New password"), "newpass123");
    await user.type(screen.getByPlaceholderText("Confirm new password"), "different");
    await user.click(screen.getByRole("button", { name: /set password/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
