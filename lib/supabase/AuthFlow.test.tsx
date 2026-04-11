// lib/supabase/AuthFlow.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AuthFlow } from "./AuthFlow";
import { MockSupabaseProvider } from "./StorybookProvider";

function renderAuthFlow(props: React.ComponentProps<typeof AuthFlow> = {}) {
  return render(
    <MockSupabaseProvider>
      <AuthFlow {...props} />
    </MockSupabaseProvider>,
  );
}

describe("AuthFlow", () => {
  describe("email screen (default)", () => {
    it("renders email input and magic link button", () => {
      renderAuthFlow();

      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /continue with magic link/i })).toBeInTheDocument();
      expect(screen.getByText(/sign in with password instead/i)).toBeInTheDocument();
    });
  });

  describe("password screen", () => {
    it("switches to password screen when clicking the link", async () => {
      const user = userEvent.setup();
      renderAuthFlow();

      await user.click(screen.getByText(/sign in with password instead/i));

      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^login$/i })).toBeInTheDocument();
      expect(screen.getByText(/back to magic link/i)).toBeInTheDocument();
    });

    it("pre-fills email from the email screen", async () => {
      const user = userEvent.setup();
      renderAuthFlow();

      const emailInput = screen.getByPlaceholderText("Email");
      await user.type(emailInput, "test@example.com");
      await user.click(screen.getByText(/sign in with password instead/i));

      expect(screen.getByPlaceholderText("Email")).toHaveValue("test@example.com");
    });

    it("switches back to email screen", async () => {
      const user = userEvent.setup();
      renderAuthFlow();

      await user.click(screen.getByText(/sign in with password instead/i));
      await user.click(screen.getByText(/back to magic link/i));

      expect(screen.getByRole("button", { name: /continue with magic link/i })).toBeInTheDocument();
      expect(screen.queryByPlaceholderText("Password")).not.toBeInTheDocument();
    });
  });
});
