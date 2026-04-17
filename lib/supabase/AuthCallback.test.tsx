import { act, render, screen } from "@testing-library/react";
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

  it("renders the expired-link error when error params are a query inside the hash path", () => {
    window.history.replaceState(
      {},
      "",
      "/#/auth/callback?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired",
    );
    const onError = vi.fn();

    renderAuthCallback({ onError });

    expect(
      screen.getByText(/this sign-in link has expired\. please request a new one\./i),
    ).toBeInTheDocument();
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("renders the access_denied message when only access_denied is present", () => {
    window.history.replaceState({}, "", "/auth/callback?error_code=access_denied");

    renderAuthCallback();

    expect(
      screen.getByText(/this sign-in link is no longer valid\. please request a new one\./i),
    ).toBeInTheDocument();
  });

  it("falls back to error_description for unknown error codes", () => {
    window.history.replaceState(
      {},
      "",
      "/auth/callback?error=server_error&error_description=Something+went+wrong",
    );

    renderAuthCallback();

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("uses a generic fallback when neither a known code nor description is present", () => {
    window.history.replaceState({}, "", "/auth/callback?error=server_error");

    renderAuthCallback();

    expect(screen.getByText(/sign-in failed\. please try again\./i)).toBeInTheDocument();
  });

  it("shows a soft 'taking longer' note after 5 seconds without erroring", async () => {
    const onError = vi.fn();

    renderAuthCallback({ onError });

    expect(screen.queryByText(/taking longer than usual/i)).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(screen.getByText(/signing you in/i)).toBeInTheDocument();
    expect(screen.getByText(/taking longer than usual/i)).toBeInTheDocument();
    expect(onError).not.toHaveBeenCalled();
  });

  it("renders a timeout error and calls onError after 30 seconds without SIGNED_IN", async () => {
    const onError = vi.fn();

    renderAuthCallback({ onError });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30000);
    });

    expect(screen.getByText(/magic link expired or invalid\. please try again\./i)).toBeInTheDocument();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
