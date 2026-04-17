import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: false });
    // Reset URL between tests so URL-error parsing starts from a clean slate.
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a loading state initially", () => {
    renderAuthCallback();

    expect(screen.getByText(/signing you in/i)).toBeInTheDocument();
  });
});
