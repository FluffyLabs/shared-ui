import { useSupabaseContext } from "./context";

export function useSession() {
  const { session, isLoading } = useSupabaseContext();
  return { session, isLoading };
}
