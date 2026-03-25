import type { User, Session } from "@supabase/supabase-js";

export type { User, Session };

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}
