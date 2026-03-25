import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input/Input";
import { Alert } from "@/ui/Alert/Alert";
import { cn } from "@/utils";
import { useSupabaseContext } from "./context";

export interface AuthFlowProps {
  onSuccess?: () => void;
  className?: string;
}

export function AuthFlow({ onSuccess, className }: AuthFlowProps) {
  const { client } = useSupabaseContext();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsSubmitting(false);
          return;
        }
        const { error } = await client.auth.signUp({ email, password });
        if (error) throw error;
        setRegistered(true);
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (registered) {
    return (
      <div className={cn("mx-auto flex w-full max-w-sm flex-col items-center gap-4", className)}>
        <Alert intent="success">
          <Alert.Title>Check your email</Alert.Title>
          <Alert.Text>
            We sent a confirmation link to <strong>{email}</strong>. Please verify your email to continue.
          </Alert.Text>
        </Alert>
        <button
          type="button"
          className="text-sm text-muted-foreground underline hover:text-foreground"
          onClick={() => {
            setRegistered(false);
            setMode("login");
          }}
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto flex w-full max-w-sm flex-col items-center gap-6", className)}>
      <div className="flex w-full gap-2">
        <button
          type="button"
          className={cn(
            "flex-1 border-b-2 pb-2 text-sm font-medium transition-colors",
            mode === "login"
              ? "border-brand text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
          onClick={() => {
            setMode("login");
            setError(null);
            setPassword("");
            setConfirmPassword("");
          }}
        >
          Login
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 border-b-2 pb-2 text-sm font-medium transition-colors",
            mode === "register"
              ? "border-brand text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
          onClick={() => {
            setMode("register");
            setError(null);
            setPassword("");
            setConfirmPassword("");
          }}
        >
          Register
        </button>
      </div>

      {error && (
        <Alert intent="destructive" className="w-full">
          <Alert.Text>{error}</Alert.Text>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        {mode === "register" && (
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "login"
              ? "Logging in..."
              : "Registering..."
            : mode === "login"
              ? "Login"
              : "Register"}
        </Button>
      </form>
    </div>
  );
}
