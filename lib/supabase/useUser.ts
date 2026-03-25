import { useSupabaseContext } from "./context";

export function useUser() {
  const { user, isLoading } = useSupabaseContext();
  return { user, isLoading };
}
