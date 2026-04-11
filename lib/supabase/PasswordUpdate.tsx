import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input/Input";
import { Alert } from "@/ui/Alert/Alert";
import { cn } from "@/utils";
import { useSupabaseContext } from "./context";

export interface PasswordUpdateProps {
  className?: string;
}

export function PasswordUpdate({ className }: PasswordUpdateProps) {
  const { client, user } = useSupabaseContext();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div>
        <p className="text-sm font-medium text-foreground">Password</p>
        <p className="text-xs text-muted-foreground">Set or change your password</p>
      </div>

      {error && (
        <Alert intent="destructive">
          <Alert.Text>{error}</Alert.Text>
        </Alert>
      )}

      {success && (
        <Alert intent="success">
          <Alert.Text>Password updated successfully.</Alert.Text>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
        <Button type="submit" disabled={isSubmitting} variant="secondary">
          {isSubmitting ? "Updating..." : "Set password"}
        </Button>
      </form>
    </div>
  );
}
