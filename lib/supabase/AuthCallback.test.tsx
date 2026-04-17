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

  it("renders an expired-link error immediately when error params are in the search string", () => {
    window.history.replaceState(
      {},
      "",
      "/auth/callback?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired",
    );
    const onError = vi.fn();

    renderAuthCallback({ onError });

    expect(
      screen.getByText(/this sign-in link has expired\. please request a new one\./i),
    ).toBeInTheDocument();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(screen.queryByText(/signing you in/i)).not.toBeInTheDocument();
  });

  it("renders the expired-link error when error params are in a nested hash fragment (HashRouter)", () => {
    window.history.replaceState(
      {},
      "",
      "/#/auth/callback#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired",
    );
    const onError = vi.fn();

    renderAuthCallback({ onError });

    expect(
      screen.getByText(/this sign-in link has expired\. please request a new one\./i),
    ).toBeInTheDocument();
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
