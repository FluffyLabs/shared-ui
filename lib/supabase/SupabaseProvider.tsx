import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { User, Session } from "@supabase/supabase-js";
import { SupabaseContext } from "./context";

export interface SupabaseProviderProps {
  supabaseUrl: string;
  supabaseAnonKey: string;
  appId: string;
  children: React.ReactNode;
}

export function SupabaseProvider({ supabaseUrl, supabaseAnonKey, appId, children }: SupabaseProviderProps) {
  const client = useMemo(() => createClient(supabaseUrl, supabaseAnonKey), [supabaseUrl, supabaseAnonKey]);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (event === "INITIAL_SESSION") {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [client]);

  const value = useMemo(() => ({ client, user, session, isLoading, appId }), [client, user, session, isLoading, appId]);

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}
