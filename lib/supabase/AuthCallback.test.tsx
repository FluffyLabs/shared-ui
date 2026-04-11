// lib/supabase/AuthCallback.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthCallback } from "./AuthCallback";
import { MockSupabaseProvider } from "./StorybookProvider";

function renderAuthCallback(props: React.ComponentProps<typeof AuthCallback> = {}) {
  return render(
    <MockSupabaseProvider>
      <AuthCallback {...props} />
    </MockSupabaseProvider>,
  );
}

describe("AuthCallback", () => {
  it("shows a loading state initially", () => {
    renderAuthCallback();

    expect(screen.getByText(/signing you in/i)).toBeInTheDocument();
  });
});
