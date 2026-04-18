# AuthCallback URL Error Handling + HashRouter Docs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `AuthCallback` render fast, specific errors when Supabase returns auth errors via URL params, soften the hard 5s timeout into a two-stage 5s/30s experience, and document the correct `redirectTo` wiring for `HashRouter` consumers.

**Architecture:** All logic stays in `lib/supabase/AuthCallback.tsx`. Two helpers are added at the top of that file: a URL param collector that understands both `window.location.search` and the nested-hash shape HashRouter produces, and an error-code → user-message mapper. The render effect checks the URL synchronously on mount, short-circuiting the subscription + timers when auth error params are present. When the URL is clean, a soft "still working" note appears at 5s and the hard error only appears at 30s. Tests switch to Vitest fake timers so they run instantly.

**Tech Stack:** React 18, Vitest, React Testing Library, @supabase/supabase-js, TypeScript, Storybook MDX.

---

## File Structure

All changes are in existing files. No new files:

- **Modify** `lib/supabase/AuthCallback.tsx` — add URL parser + message mapper + two-stage timeout
- **Modify** `lib/supabase/AuthCallback.test.tsx` — fake timers, URL error cases, timeout stages
- **Modify** `lib/supabase/Supabase.mdx` — HashRouter subsection + BrowserRouter note on existing example

---

## Task 1: Set up fake timers in the test file

**Files:**
- Modify: `lib/supabase/AuthCallback.test.tsx`

This task changes test plumbing only. No production changes yet. Fake timers let later tasks advance through 5s and 30s timers instantly. We also add a helper that resets `window.location` between tests via `history.replaceState` (jsdom supports this and it is how we will inject URL error params in later tasks).

- [ ] **Step 1: Update the test file with fake timers setup**

Replace the current contents of `lib/supabase/AuthCallback.test.tsx` with:

```tsx
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
```

- [ ] **Step 2: Run the tests to verify they still pass**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: 1 test passes.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/AuthCallback.test.tsx
git commit -m "test(auth-callback): switch to fake timers and reset URL between tests"
```

---

## Task 2: Test + implement URL `?error=...` (search) parsing

**Files:**
- Modify: `lib/supabase/AuthCallback.test.tsx`
- Modify: `lib/supabase/AuthCallback.tsx`

Supabase can deliver auth errors via the URL's query string (e.g. `?error=access_denied&error_code=otp_expired&error_description=...`). We make `AuthCallback` detect this on mount and render the mapped error immediately, without waiting on timers or `onAuthStateChange`.

- [ ] **Step 1: Add a failing test for the search-string error path**

In `lib/supabase/AuthCallback.test.tsx`, append this test inside the existing `describe` block:

```tsx
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
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: the new test fails because `AuthCallback` currently renders `"Signing you in..."` for clean-URL mounts and ignores search params.

- [ ] **Step 3: Add the URL parser and message mapper helpers**

In `lib/supabase/AuthCallback.tsx`, add these two module-local helpers above the `AuthCallback` component (below the imports):

```tsx
const AUTH_ERROR_KEYS = ["error", "error_code", "error_description"] as const;

function collectAuthErrorParams(search: string, hash: string): URLSearchParams {
  const out = new URLSearchParams();
  const mergeKnown = (src: URLSearchParams) => {
    for (const key of AUTH_ERROR_KEYS) {
      const value = src.get(key);
      if (value !== null && !out.has(key)) {
        out.set(key, value);
      }
    }
  };

  mergeKnown(new URLSearchParams(search));

  for (const segment of hash.split("#").filter(Boolean)) {
    if (segment.startsWith("/")) {
      const queryIdx = segment.indexOf("?");
      if (queryIdx >= 0) {
        mergeKnown(new URLSearchParams(segment.slice(queryIdx + 1)));
      }
    } else {
      mergeKnown(new URLSearchParams(segment));
    }
  }

  return out;
}

function authErrorMessage(code: string | null, description: string | null): string {
  if (code === "otp_expired") {
    return "This sign-in link has expired. Please request a new one.";
  }
  if (code === "access_denied") {
    return "This sign-in link is no longer valid. Please request a new one.";
  }
  return description ?? "Sign-in failed. Please try again.";
}
```

- [ ] **Step 4: Use the helpers in the effect to short-circuit on URL errors**

In `lib/supabase/AuthCallback.tsx`, modify the existing second `useEffect` (the one that sets up `onAuthStateChange` and the 5s timeout). Add the URL-error short-circuit at the top of the effect body, after the `if (user) return;` guard and before `let settled = false;`:

```tsx
  useEffect(() => {
    // Already signed in — no need to listen or timeout.
    if (user) return;

    // If Supabase redirected back with an auth error in the URL, surface it
    // immediately without waiting for the listener or timer.
    const errorParams = collectAuthErrorParams(window.location.search, window.location.hash);
    const errorCode = errorParams.get("error_code") ?? errorParams.get("error");
    if (errorCode) {
      const message = authErrorMessage(errorCode, errorParams.get("error_description"));
      setError(message);
      stableOnError(new Error(message));
      return;
    }

    let settled = false;
    // ... existing subscription + timeout code unchanged ...
```

Leave everything after `let settled = false;` unchanged.

- [ ] **Step 5: Run the test and verify it passes**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: all tests pass (original loading-state test + new error-search test).

- [ ] **Step 6: Commit**

```bash
git add lib/supabase/AuthCallback.tsx lib/supabase/AuthCallback.test.tsx
git commit -m "feat(auth-callback): surface Supabase errors from URL search params"
```

---

## Task 3: Test URL hash `#/path#error=...` (HashRouter shape)

**Files:**
- Modify: `lib/supabase/AuthCallback.test.tsx`

The parser was written to handle this case too. This task locks the behavior in with a test that matches the actual URL shape that triggered the bug in downstream HashRouter apps.

- [ ] **Step 1: Add a failing test for the HashRouter nested-hash shape**

In `lib/supabase/AuthCallback.test.tsx`, append inside the existing `describe`:

```tsx
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
```

- [ ] **Step 2: Run the test and verify it passes**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: passes — the `collectAuthErrorParams` helper already splits by `#` and skips path-like segments.

If it fails: the parser isn't skipping the path segment correctly. Inspect the value of `window.location.hash` inside the test (`console.log(window.location.hash)` — should be `#/auth/callback#error=...`) and confirm `collectAuthErrorParams` handles a leading `/`-prefixed segment.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/AuthCallback.test.tsx
git commit -m "test(auth-callback): cover HashRouter nested-hash error shape"
```

---

## Task 4: Test URL hash `#/path?error=...` (query-inside-hash)

**Files:**
- Modify: `lib/supabase/AuthCallback.test.tsx`

Some routers (and some Supabase flows) produce a query string inside the hash rather than a second `#`. The parser extracts the `?...` portion from path-like segments. This task locks that in.

- [ ] **Step 1: Add a failing test for the query-inside-hash shape**

In `lib/supabase/AuthCallback.test.tsx`, append inside the existing `describe`:

```tsx
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
```

- [ ] **Step 2: Run the test and verify it passes**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/AuthCallback.test.tsx
git commit -m "test(auth-callback): cover query-inside-hash error shape"
```

---

## Task 5: Test the error-code → message mapping (unknown code + description, access_denied)

**Files:**
- Modify: `lib/supabase/AuthCallback.test.tsx`

Cover the remaining branches of `authErrorMessage`: `access_denied` (without `otp_expired`), an unknown code that falls back to `error_description`, and the generic fallback when no description is provided.

- [ ] **Step 1: Add failing tests for the remaining message-mapping branches**

In `lib/supabase/AuthCallback.test.tsx`, append inside the existing `describe`:

```tsx
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
```

- [ ] **Step 2: Run the tests and verify they pass**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: all pass — the mapping helper already covers these branches.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/AuthCallback.test.tsx
git commit -m "test(auth-callback): cover error-code message mapping branches"
```

---

## Task 6: Two-stage timeout — soft note at 5s

**Files:**
- Modify: `lib/supabase/AuthCallback.test.tsx`
- Modify: `lib/supabase/AuthCallback.tsx`

Replace the hard 5s error with a soft "taking longer" note under the loading text. The existing hard error moves to 30s (next task). This task only covers the 5s soft note.

- [ ] **Step 1: Add a failing test for the 5s soft note**

In `lib/supabase/AuthCallback.test.tsx`, append inside the existing `describe`:

```tsx
  it("shows a soft 'taking longer' note after 5 seconds without erroring", async () => {
    const onError = vi.fn();

    renderAuthCallback({ onError });

    expect(screen.queryByText(/taking longer than usual/i)).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(5000);

    expect(screen.getByText(/signing you in/i)).toBeInTheDocument();
    expect(screen.getByText(/taking longer than usual/i)).toBeInTheDocument();
    expect(onError).not.toHaveBeenCalled();
  });
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: fails — the component currently sets an error at 5s, so `"taking longer than usual"` is not rendered and the existing hard error fires.

- [ ] **Step 3: Add the `takingLonger` state and adjust the effect**

In `lib/supabase/AuthCallback.tsx`:

Add the new state alongside the existing `error` state at the top of `AuthCallback`:

```tsx
  const [error, setError] = useState<string | null>(null);
  const [takingLonger, setTakingLonger] = useState(false);
```

Replace the existing single-timeout block inside the effect (the one that currently sets a 5s error) with a soft-note timer. Leave the `setError` / `stableOnError` / `settled = true` block out for now — it moves to a 30s timer in the next task. The effect section changes from:

```tsx
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      const message = "Magic link expired or invalid. Please try again.";
      setError(message);
      stableOnError(new Error(message));
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
```

to:

```tsx
    const softNoteTimeout = setTimeout(() => {
      if (settled) return;
      setTakingLonger(true);
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(softNoteTimeout);
    };
```

Also clear `softNoteTimeout` in the `SIGNED_IN` branch of the existing `onAuthStateChange` handler. The handler changes from:

```tsx
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !settled) {
        settled = true;
        clearTimeout(timeout);
        stableOnSuccess();
      }
    });
```

to:

```tsx
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !settled) {
        settled = true;
        clearTimeout(softNoteTimeout);
        stableOnSuccess();
      }
    });
```

Finally, update the loading render branch (the one returning `"Signing you in..."`) to show the soft note when `takingLonger` is true:

```tsx
  return (
    <div className={cn("mx-auto flex w-full max-w-sm flex-col items-center gap-4 py-8", className)}>
      <p className="text-sm text-muted-foreground">Signing you in...</p>
      {takingLonger && (
        <p className="text-xs text-muted-foreground">This is taking longer than usual…</p>
      )}
    </div>
  );
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: the 5s soft-note test passes.

- [ ] **Step 5: Commit**

```bash
git add lib/supabase/AuthCallback.tsx lib/supabase/AuthCallback.test.tsx
git commit -m "feat(auth-callback): show soft 'taking longer' note at 5s instead of erroring"
```

---

## Task 7: Two-stage timeout — hard error at 30s

**Files:**
- Modify: `lib/supabase/AuthCallback.test.tsx`
- Modify: `lib/supabase/AuthCallback.tsx`

Add the second timer. If neither `SIGNED_IN` nor a URL error arrives within 30s, render the error and call `onError`.

- [ ] **Step 1: Add a failing test for the 30s hard error**

In `lib/supabase/AuthCallback.test.tsx`, append inside the existing `describe`:

```tsx
  it("renders a timeout error and calls onError after 30 seconds without SIGNED_IN", async () => {
    const onError = vi.fn();

    renderAuthCallback({ onError });

    await vi.advanceTimersByTimeAsync(30000);

    expect(screen.getByText(/magic link expired or invalid\. please try again\./i)).toBeInTheDocument();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
  });
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: fails — there is no 30s timer yet.

- [ ] **Step 3: Add the 30s error timer**

In `lib/supabase/AuthCallback.tsx`, inside the same effect, add a second `setTimeout` right after the existing `softNoteTimeout` declaration:

```tsx
    const softNoteTimeout = setTimeout(() => {
      if (settled) return;
      setTakingLonger(true);
    }, 5000);

    const errorTimeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      const message = "Magic link expired or invalid. Please try again.";
      setError(message);
      stableOnError(new Error(message));
    }, 30000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(softNoteTimeout);
      clearTimeout(errorTimeout);
    };
```

Also clear `errorTimeout` in the `SIGNED_IN` handler:

```tsx
      if (event === "SIGNED_IN" && !settled) {
        settled = true;
        clearTimeout(softNoteTimeout);
        clearTimeout(errorTimeout);
        stableOnSuccess();
      }
```

- [ ] **Step 4: Run the test and verify it passes**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/supabase/AuthCallback.tsx lib/supabase/AuthCallback.test.tsx
git commit -m "feat(auth-callback): give up after 30s instead of 5s"
```

---

## Task 8: URL errors short-circuit the timers

**Files:**
- Modify: `lib/supabase/AuthCallback.test.tsx`

Lock in that when the URL already has an auth error, neither the 5s soft note nor the 30s hard error contributes anything further — `onError` must not be called twice, and the soft-note text must not appear.

- [ ] **Step 1: Add a failing test that advances past 30s on an error URL**

In `lib/supabase/AuthCallback.test.tsx`, append inside the existing `describe`:

```tsx
  it("does not fire timers when the URL already has an error", async () => {
    window.history.replaceState(
      {},
      "",
      "/auth/callback?error_code=otp_expired",
    );
    const onError = vi.fn();

    renderAuthCallback({ onError });

    expect(onError).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(31000);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/taking longer than usual/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/magic link expired or invalid/i)).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run the test and verify it passes**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: passes — the URL-error short-circuit in the effect returns before any timer is set up, and the rendered error block replaces the loading state entirely.

If it fails: the URL-error branch isn't returning early from the effect. Verify the `return` after `stableOnError(new Error(message))` is present and nothing below it runs.

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/AuthCallback.test.tsx
git commit -m "test(auth-callback): verify URL errors short-circuit the timers"
```

---

## Task 9: Update docs — `HashRouter` subsection and `BrowserRouter` note

**Files:**
- Modify: `lib/supabase/Supabase.mdx`

Document the correct `redirectTo` value for apps using `HashRouter`, and flag the existing example as assuming `BrowserRouter`.

- [ ] **Step 1: Annotate the existing `AuthCallback` example as BrowserRouter**

In `lib/supabase/Supabase.mdx`, find this paragraph near the existing example (around line 186):

```
Mount `AuthCallback` at the route matching your `redirectTo` URL. It handles the token exchange and redirects on success.
```

Replace it with:

```
Mount `AuthCallback` at the route matching your `redirectTo` URL. It handles the token exchange and redirects on success. The example below assumes `BrowserRouter`. If your app uses `HashRouter`, see [Using HashRouter](#using-hashrouter) below.
```

- [ ] **Step 2: Add the new `Using HashRouter` subsection**

In `lib/supabase/Supabase.mdx`, add this subsection immediately after the existing `### Add the AuthCallback page` block (after the closing of the `AuthCallbackPage` code example, before `### Add the Settings page`):

````mdx
### Using HashRouter

If your app uses `HashRouter` (for example, static hosting like GitHub Pages), the callback route only exists *inside* the hash. Your `redirectTo` must include `/#/` so Supabase delivers users back to a URL your router can match:

```tsx
<AuthFlow
  onSuccess={() => navigate("/")}
  redirectTo={window.location.origin + "/#/auth/callback"}
/>
```

Add the **full** URL — including `/#/auth/callback` — to your Supabase project's **Redirect URLs** allow-list.

Mount `AuthCallback` at `/auth/callback` inside your HashRouter:

```tsx
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthCallback } from "@fluffylabs/shared-ui/supabase";

<HashRouter>
  <Routes>
    <Route path="/auth/callback" element={<AuthCallback onSuccess={() => navigate("/")} />} />
    {/* your other routes */}
  </Routes>
</HashRouter>
```

**Common pitfall:** if `redirectTo` omits `/#/` (for example, `${origin}/auth/callback`), Supabase appends its error params as a hash fragment at the site root — e.g. `https://your-app.com/#error=access_denied&error_code=otp_expired&...`. `HashRouter` then tries to match the error string as a route path and React Router logs `No routes matched location "/error=access_denied&..."`. Including `/#/` in both `redirectTo` and the Supabase allow-list fixes this.
````

- [ ] **Step 3: Sanity-check the MDX builds**

Run: `npx vitest run lib/supabase/AuthCallback.test.tsx`
Expected: tests still pass (sanity check — this task doesn't change test behavior).

Run: `npm run lint`
Expected: no new lint errors.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/Supabase.mdx
git commit -m "docs(supabase): explain redirectTo wiring for HashRouter consumers"
```

---

## Task 10: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 2: Run the linter**

Run: `npm run lint`
Expected: no errors, no new warnings.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Inspect the final `AuthCallback.tsx`**

Open `lib/supabase/AuthCallback.tsx` and confirm:
- `collectAuthErrorParams` and `authErrorMessage` are module-local (not exported).
- The effect body order is: `if (user) return;` → URL-error short-circuit (early `return`) → `let settled = false;` → subscription → 5s soft-note timer → 30s hard-error timer → cleanup clears both.
- Both timers are cleared in the `SIGNED_IN` branch.
- The loading render includes the `takingLonger` soft note.

- [ ] **Step 5: Done — no commit for this task**

---

## Post-implementation check against the spec

Before opening the PR, skim the spec (`docs/superpowers/specs/2026-04-17-auth-callback-url-errors-design.md`) and confirm each section has a corresponding task:

- Component 1 (URL error parsing) → Tasks 2, 3, 4
- Component 2 (Error-code message mapping) → Tasks 2 (primary message), 5 (remaining branches)
- Component 3 (Two-stage timeout) → Tasks 6, 7, 8
- Component 4 (Tests) → woven through every task
- Component 5 (Docs) → Task 9

No spec section is left without a task.
