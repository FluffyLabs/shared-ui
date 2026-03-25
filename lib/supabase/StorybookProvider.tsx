/**
 * Mock SupabaseProvider for Storybook stories.
 * Renders components with controllable auth state, no real Supabase connection needed.
 */
import { useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import type { User, Session } from "@supabase/supabase-js";
import { SupabaseContext } from "./context";

export interface MockSupabaseProviderProps {
  children: React.ReactNode;
  appId?: string;
  /** Provide a mock user to simulate logged-in state */
  user?: Partial<User> | null;
  isLoading?: boolean;
}

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export function MockSupabaseProvider({
  children,
  appId = "storybook",
  user = null,
  isLoading = false,
}: MockSupabaseProviderProps) {
  const value = useMemo(() => {
    const client = createClient(PLACEHOLDER_URL, PLACEHOLDER_KEY);
    const mockUser = user ? ({ id: "mock-user-id", email: "user@example.com", ...user } as User) : null;
    const mockSession = mockUser ? ({ user: mockUser, access_token: "mock-token" } as Session) : null;

    return {
      client,
      user: mockUser,
      session: mockSession,
      isLoading,
      appId,
    };
  }, [user, isLoading, appId]);

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}
