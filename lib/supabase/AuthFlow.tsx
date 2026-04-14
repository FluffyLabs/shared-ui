import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input/Input";
import { Alert } from "@/ui/Alert/Alert";
import { cn } from "@/utils";
import { useSupabaseContext } from "./context";

export interface AuthFlowProps {
  /** Called after successful password login. Magic link logins are handled by AuthCallback. */
  onSuccess?: () => void;
  /** URL that Supabase redirects to after the user clicks the magic link. */
  redirectTo?: string;
  className?: string;
}

type Screen = "email" | "magic-link-sent" | "password";

export function AuthFlow({ onSuccess, redirectTo, className }: AuthFlowProps) {
  const { client } = useSupabaseContext();
  const [screen, setScreen] = useState<Screen>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleMagicLink(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await client.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      setScreen("magic-link-sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (screen === "magic-link-sent") {
    return (
      <div className={cn("mx-auto flex w-full max-w-sm flex-col items-center gap-4", className)}>
        <Alert intent="success">
          <Alert.Title>Check your email</Alert.Title>
          <Alert.Text>
            We sent a magic link to <strong>{email}</strong>. Click the link in your email to sign in.
          </Alert.Text>
        </Alert>
        <button
          type="button"
          className="text-sm text-muted-foreground underline hover:text-foreground"
          onClick={() => {
            setScreen("email");
            setError(null);
          }}
        >
          Back
        </button>
      </div>
    );
  }

  if (screen === "password") {
    return (
      <div className={cn("mx-auto flex w-full max-w-sm flex-col items-center gap-6", className)}>
        {error && (
          <Alert intent="destructive" className="w-full">
            <Alert.Text>{error}</Alert.Text>
          </Alert>
        )}

        <form onSubmit={handlePasswordLogin} className="flex w-full flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <button
          type="button"
          disabled={isSubmitting}
          className="text-sm text-muted-foreground underline hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          onClick={() => {
            setScreen("email");
            setError(null);
            setPassword("");
          }}
        >
          Back to magic link
        </button>
      </div>
    );
  }

  // Default: email screen
  return (
    <div className={cn("mx-auto flex w-full max-w-sm flex-col items-center gap-6", className)}>
      {error && (
        <Alert intent="destructive" className="w-full">
          <Alert.Text>{error}</Alert.Text>
        </Alert>
      )}

      <form onSubmit={handleMagicLink} className="flex w-full flex-col gap-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending magic link..." : "Continue with magic link"}
        </Button>
      </form>

      <button
        type="button"
        disabled={isSubmitting}
        className="text-sm text-muted-foreground underline hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        onClick={() => {
          setScreen("password");
          setError(null);
        }}
      >
        Sign in with password instead
      </button>
    </div>
  );
}
