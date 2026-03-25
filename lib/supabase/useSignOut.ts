import { useCallback } from "react";
import { useSupabaseContext } from "./context";

export function useSignOut() {
  const { client } = useSupabaseContext();
  return useCallback(() => client.auth.signOut(), [client]);
}
