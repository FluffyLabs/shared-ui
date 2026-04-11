import { useCallback, useEffect, useState } from "react";
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

export function AuthCallback({ onSuccess, onError, className }: AuthCallbackProps) {
  const { client, user } = useSupabaseContext();
  const [error, setError] = useState<string | null>(null);

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

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        stableOnSuccess();
      }
    });

    const timeout = setTimeout(() => {
      const message = "Magic link expired or invalid. Please try again.";
      setError(message);
      stableOnError(new Error(message));
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
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
    </div>
  );
}
