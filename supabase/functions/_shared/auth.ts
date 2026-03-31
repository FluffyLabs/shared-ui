import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { User } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";

/**
 * Authenticate the user from the request's Authorization header.
 * Returns the user on success, or a 401 Response on failure.
 */
export async function authenticateUser(req: Request): Promise<{ user: User } | { response: Response }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return {
      response: new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }),
    };
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      response: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }),
    };
  }

  return { user };
}
