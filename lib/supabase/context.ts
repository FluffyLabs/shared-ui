import { createContext, useContext } from "react";
import type { SupabaseClient, User, Session } from "@supabase/supabase-js";

export interface SupabaseContextValue {
  client: SupabaseClient;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  appId: string;
}

export const SupabaseContext = createContext<SupabaseContextValue | null>(null);

export function useSupabaseContext() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabaseContext must be used within a SupabaseProvider");
  }
  return context;
}
