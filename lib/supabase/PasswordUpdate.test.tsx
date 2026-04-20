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

  it("hides the password form until Set/Change is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MockSupabaseProvider user={{ email: "test@example.com" }}>
        <PasswordUpdate />
      </MockSupabaseProvider>,
    );

    expect(screen.queryByPlaceholderText("New password")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Confirm new password")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /set\/change password/i }));

    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm new password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^set password$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();
    render(
      <MockSupabaseProvider user={{ email: "test@example.com" }}>
        <PasswordUpdate />
      </MockSupabaseProvider>,
    );

    await user.click(screen.getByRole("button", { name: /set\/change password/i }));
    await user.type(screen.getByPlaceholderText("New password"), "newpass123");
    await user.type(screen.getByPlaceholderText("Confirm new password"), "different");
    await user.click(screen.getByRole("button", { name: /^set password$/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("Cancel collapses the form and clears the fields", async () => {
    const user = userEvent.setup();
    render(
      <MockSupabaseProvider user={{ email: "test@example.com" }}>
        <PasswordUpdate />
      </MockSupabaseProvider>,
    );

    await user.click(screen.getByRole("button", { name: /set\/change password/i }));
    await user.type(screen.getByPlaceholderText("New password"), "newpass123");
    await user.type(screen.getByPlaceholderText("Confirm new password"), "newpass123");
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.queryByPlaceholderText("New password")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Confirm new password")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /set\/change password/i }));
    expect(screen.getByPlaceholderText("New password")).toHaveValue("");
    expect(screen.getByPlaceholderText("Confirm new password")).toHaveValue("");
  });
});
