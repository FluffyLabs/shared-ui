# Magic-Link-First Auth Flow Redesign

## Summary

Replace the current login/register tab-based auth flow with a magic-link-first
unified flow. The primary path is: enter email, receive magic link, click it,
done. Password login exists as a secondary option for users who have set a
password. Password management moves to Settings.

## Motivation

- Users who forget their password have no recovery path today.
- The login vs register distinction is unnecessary — Supabase's `signInWithOtp`
  creates accounts automatically.
- A magic-link-first flow eliminates "forgot password" as a concept entirely.

## Components

### 1. AuthFlow (redesign of existing)

**File:** `lib/supabase/AuthFlow.tsx`

Replaces the current login/register tabs. Three internal screens, managed via
local state:

#### Screen: "email" (default)

- Email input field
- "Continue with magic link" button — calls
  `client.auth.signInWithOtp({ email, options: { emailRedirectTo } })`
- Small text link: "Sign in with password instead" — switches to "password"
  screen

#### Screen: "magic-link-sent"

- Success alert: "We sent a magic link to **{email}**. Click the link in your
  email to sign in."
- "Back" link — returns to "email" screen

#### Screen: "password"

- Email input (pre-filled from "email" screen)
- Password input
- "Login" button — calls `client.auth.signInWithPassword({ email, password })`
- "Back to magic link" link — returns to "email" screen

**Props (updated):**

```ts
export interface AuthFlowProps {
  /** Called after successful password login. Magic link logins are handled by AuthCallback. */
  onSuccess?: () => void;
  /** URL that Supabase redirects to after the user clicks the magic link. */
  redirectTo?: string;
  className?: string;
}
```

**Removed:** `mode` state (login/register tabs), `confirmPassword` field,
`registered` state. The register flow is gone — `signInWithOtp` handles both
new and existing users.

### 2. AuthCallback (new)

**File:** `lib/supabase/AuthCallback.tsx`

A component that consuming apps mount at their magic-link redirect route (e.g.,
`/auth/callback`). Responsibilities:

1. On mount, detect auth tokens in the URL (Supabase appends them as hash
   fragments or query params).
2. Supabase client's `onAuthStateChange` listener (already in
   `SupabaseProvider`) handles the session automatically when the page loads
   with valid tokens. `AuthCallback` just needs to:
   - Show a loading state while the session is being established.
   - Call `onSuccess` (or redirect) once the user is authenticated.
   - Show an error if the link is invalid/expired.
3. Provide `onSuccess` and `onError` callbacks.

```ts
export interface AuthCallbackProps {
  /** Called when the session is successfully established. */
  onSuccess?: () => void;
  /** Called when the magic link is invalid or expired. */
  onError?: (error: Error) => void;
  className?: string;
}
```

**Implementation notes:**

- Use `useEffect` to listen for `onAuthStateChange` events of type
  `SIGNED_IN`.
- If no auth event fires within a reasonable timeout (~5s), show an error
  message with a link back to login.

### 3. PasswordUpdate (new)

**File:** `lib/supabase/PasswordUpdate.tsx`

A settings section for setting or changing the user's password. Embedded in the
`Settings` component directly, below the Theme setting.

- "New password" input
- "Confirm new password" input
- "Set password" / "Update password" button — calls
  `client.auth.updateUser({ password })`
- Success/error feedback inline

```ts
export interface PasswordUpdateProps {
  className?: string;
}
```

**Requires an active session.** If no user is logged in, renders nothing.

### 4. Settings (updated)

**File:** `lib/supabase/Settings.tsx`

Add the `PasswordUpdate` section below the existing Theme setting. This keeps
Settings as a single component that includes all standard settings out of the
box.

## Library Exports

Add to `lib/supabase/index.ts`:

```ts
export { AuthCallback } from "./AuthCallback";
export type { AuthCallbackProps } from "./AuthCallback";
export { PasswordUpdate } from "./PasswordUpdate";
export type { PasswordUpdateProps } from "./PasswordUpdate";
```

## Demo App Updates

**File:** `demo/src/App.tsx`

1. Update `LoginPage` to pass `redirectTo` prop pointing to the demo's callback
   URL (e.g., `window.location.origin + "/auth/callback"`).
2. Add an `/auth/callback` page that renders `<AuthCallback>` and redirects to
   home on success.
3. Settings page already renders `<Settings />` which will now include password
   management.

Note: The demo app uses a simple `page` state variable for routing, not a URL
router. For magic link redirects to work in the demo, the callback page needs
to be detected from `window.location.pathname` on initial load, before the
React state takes over. Add a check at the top of `DemoApp` that reads
`window.location.pathname` and sets the initial page to `"auth-callback"` if it
matches.

## Supabase Configuration Requirements

Consuming apps must configure in their Supabase dashboard:

- **Site URL**: The app's base URL
- **Redirect URLs**: Add the callback URL (e.g.,
  `https://myapp.com/auth/callback`) to the allow-list under Authentication >
  URL Configuration

## Error Handling

- **Magic link send failure**: Show error inline in AuthFlow (e.g., rate
  limiting, invalid email).
- **Expired/invalid magic link**: AuthCallback shows an error with a "Back to
  login" link.
- **Password login failure**: Show error inline (wrong password, account not
  found).
- **Password update failure**: Show error inline in PasswordUpdate (too short,
  etc.).

## What's NOT Included

- No "Forgot password?" link or `resetPasswordForEmail` flow. Users who forget
  their password log in via magic link and reset it in Settings.
- No email OTP (6-digit code) flow. Magic links only.
- No social auth (Google, GitHub, etc.).
- No changes to `SupabaseProvider`, hooks, or backend (Edge Functions,
  migrations).
