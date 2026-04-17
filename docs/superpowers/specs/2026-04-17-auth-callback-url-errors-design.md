# AuthCallback URL Error Handling + HashRouter Docs

## Summary

Make `AuthCallback` detect Supabase auth errors that arrive via URL params
(`error`, `error_code`, `error_description`) and render a specific,
immediate error message instead of waiting for a timeout. Soften the
existing hard timeout into a two-stage experience (still-working note at
5s, give up at 30s). Document how to wire `redirectTo` correctly when the
consuming app uses `HashRouter`.

## Motivation

Downstream apps using `HashRouter` hit this error when an expired magic
link is clicked:

```
No routes matched location "/error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired&sb="
```

Two separate problems produce it:

1. **`AuthCallback` ignores URL error params.** Even when the callback
   route does match, the component only listens for `SIGNED_IN` or times
   out after 5s with a generic message. Supabase's explicit error signal
   in the URL is dropped.
2. **`HashRouter` + misconfigured `redirectTo`.** If `redirectTo` is set
   to `${origin}/auth/callback` (no `/#/` prefix), Supabase appends error
   params as a hash fragment at the site root — e.g.
   `${origin}/#error=access_denied&...`. `HashRouter` treats the whole
   thing after the first `#` as the route path, can't match it, and
   `AuthCallback` never mounts.

We fix (1) in code so the error UX is fast and specific. We fix (2) in
docs so HashRouter consumers configure `redirectTo` correctly and land on
the callback route in the first place.

The existing hard 5s timeout is separately too aggressive on slow
networks (PKCE code exchange in particular can take several seconds).
With URL-error parsing in place, timeouts should only fire when
something is actually hanging — so we make the patient path more
patient.

## Components

### 1. `AuthCallback` — URL error parsing

**File:** `lib/supabase/AuthCallback.tsx`

On mount, before starting the auth-state listener or timers, collect
auth-related key/value pairs from the URL:

- All pairs from `window.location.search`.
- All pairs from each `#`-separated segment of `window.location.hash`.
  A HashRouter URL after a Supabase error redirect can look like
  `#/auth/callback#error=access_denied&error_code=otp_expired&...` —
  `window.location.hash` is the whole string including the inner `#`.
  Split by `#`, and for each non-empty segment:
  - If it starts with `/`, treat it as a HashRouter path — only extract
    pairs from its `?...` query, if any.
  - Otherwise, parse it as a `URLSearchParams` key/value string.

If the collected params contain `error` or `error_code`:

1. Map the code to a user-facing message (see next section).
2. Set the error state, call `onError(new Error(message))`, and return
   early — do not start the listener or the timers.

If no error params are present, the existing `onAuthStateChange`
subscription and timers run as before (with revised timing — see below).

### 2. Error-code message mapping

```
otp_expired     → "This sign-in link has expired. Please request a new one."
access_denied   → "This sign-in link is no longer valid. Please request a new one."
otherwise       → decoded error_description, or
                  "Sign-in failed. Please try again." if none provided
```

`error_description` arrives form-encoded (`+` for spaces, `%XX`
escapes). Using `URLSearchParams` for parsing handles both
automatically, so `params.get("error_description")` returns a
ready-to-render string. No manual decoding needed.

The error is rendered in the existing destructive `<Alert>` block — no
new visual treatment.

### 3. Two-stage timeout

Replace the current single 5s-error timeout with:

- **At 5s:** render a soft note under the existing `"Signing you in…"`
  text: `"This is taking longer than usual…"`. Component stays in the
  loading state; listener and 30s timer keep running.
- **At 30s:** render the error state (same alert as today), call
  `onError`, unsubscribe.

Both timers are cleared on `SIGNED_IN` or on unmount. Neither runs if
URL error params were detected on mount.

No new prop: keep `AuthCallback`'s API unchanged. Tests use fake timers
to avoid actually waiting 30s.

### 4. Tests

**File:** `lib/supabase/AuthCallback.test.tsx`

New cases:

- URL has `?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired`
  in search → renders the expired message immediately, `onError` is
  called, neither timer fires.
- URL has `#/auth/callback#error=access_denied&error_code=otp_expired&...`
  in hash (HashRouter shape) → same.
- URL has `#/auth/callback?error=...` in hash (query-inside-hash) → same.
- Unknown `error_code` with `error_description=Something+happened` →
  shows `"Something happened"`.
- Error params but no `error_description` and unknown code → shows the
  generic `"Sign-in failed. Please try again."`.

Existing timeout tests to revise:

- At 5s with a clean URL and no `SIGNED_IN`: shows `"This is taking
  longer than usual…"` under the loading text; no error, `onError` not
  called.
- At 30s with a clean URL and no `SIGNED_IN`: shows the error and calls
  `onError`.

All timer tests switch to `vi.useFakeTimers()` so they complete in
milliseconds.

### 5. Docs — `Supabase.mdx`

**File:** `lib/supabase/Supabase.mdx`

Add a new subsection under the magic-link setup area titled
**"Using HashRouter"** with:

- Explicit `redirectTo` example:
  `` `${window.location.origin}/#/auth/callback` `` (note the `/#/`).
- Explicit Supabase dashboard allowlist entry: the full URL including
  `/#/auth/callback`.
- Short example mounting `<AuthCallback>` inside a HashRouter route:

  ```tsx
  <HashRouter>
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback onSuccess={...} onError={...} />} />
      {/* ... */}
    </Routes>
  </HashRouter>
  ```

- Failure-mode callout: if `redirectTo` omits `/#/`, Supabase drops
  error params at the site root as a hash fragment, `HashRouter` tries
  to match the error string as a route path, and you get the
  `"No routes matched"` error. The fix is to include `/#/` in
  `redirectTo` and in the Supabase redirect allowlist.

Also update the existing setup example near line 176 of `Supabase.mdx`
to make clear the example assumes `BrowserRouter` and link to the new
HashRouter subsection.

## Library Exports

None. No new exports. `AuthCallback`'s props are unchanged.

## What's NOT Included

- No new component. `AuthCallback` already serves this role; adding a
  second error-specific component fragments the API.
- No new prop on `AuthCallback`. Consumers already handle navigation
  via `onError`.
- No pre-router URL-rewriting shim. Misconfigured `redirectTo` is
  addressed in docs, not by silently rewriting URLs.
- No switch to PKCE flow. Worth considering separately, but orthogonal
  to this fix and would not by itself solve the HashRouter path issue.
- No changes to `AuthFlow`, `SupabaseProvider`, hooks, or backend.
