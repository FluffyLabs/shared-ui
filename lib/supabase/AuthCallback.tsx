import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Alert } from "@/ui/Alert/Alert";
import { cn } from "@/utils";
import { useSupabaseContext } from "./context";

export interface AuthCallbackProps {
  /** Called when the session is successfully established. */
  onSuccess?: () => void;
  /** Called when the magic link is invalid or expired. */
  onError?: (error: Error) => void;
  className?: string;
}

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

export function AuthCallback({ onSuccess, onError, className }: AuthCallbackProps) {
  const { client, user } = useSupabaseContext();
  const [error, setError] = useState<string | null>(null);
  const [takingLonger, setTakingLonger] = useState(false);

  // Memoize to avoid re-running effects when consumer doesn't stabilize callbacks.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableOnSuccess = useCallback(() => onSuccess?.(), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableOnError = useCallback((err: Error) => onError?.(err), []);

  // If SupabaseProvider already established the session (e.g. it processed the
  // magic-link tokens before this component mounted), fire onSuccess immediately.
  useEffect(() => {
    if (user) {
      stableOnSuccess();
    }
  }, [user, stableOnSuccess]);

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

    const softNoteTimeout = setTimeout(() => {
      if (settled) return;
      flushSync(() => setTakingLonger(true));
    }, 5000);

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !settled) {
        settled = true;
        clearTimeout(softNoteTimeout);
        stableOnSuccess();
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(softNoteTimeout);
    };
  }, [client, user, stableOnSuccess, stableOnError]);

  if (error) {
    return (
      <div className={cn("mx-auto flex w-full max-w-sm flex-col items-center gap-4", className)}>
        <Alert intent="destructive">
          <Alert.Title>Sign-in failed</Alert.Title>
          <Alert.Text>{error}</Alert.Text>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto flex w-full max-w-sm flex-col items-center gap-4 py-8", className)}>
      <p className="text-sm text-muted-foreground">Signing you in...</p>
      {takingLonger && (
        <p className="text-xs text-muted-foreground">This is taking longer than usual…</p>
      )}
    </div>
  );
}
