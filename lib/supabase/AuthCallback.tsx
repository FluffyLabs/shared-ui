// lib/supabase/AuthCallback.tsx
import { useEffect, useState } from "react";
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
  const { client } = useSupabaseContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        onSuccess?.();
      }
    });

    const timeout = setTimeout(() => {
      const message = "Magic link expired or invalid. Please try again.";
      setError(message);
      onError?.(new Error(message));
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [client, onSuccess, onError]);

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
