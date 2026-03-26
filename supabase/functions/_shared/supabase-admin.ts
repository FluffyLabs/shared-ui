import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Admin client with service role key — bypasses RLS.
// Only use in Edge Functions for operations the user shouldn't do directly
// (e.g., updating subscription status from Stripe webhooks).
export const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
