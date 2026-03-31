// Creates a Stripe Customer Portal session for managing an existing subscription.
//
// Called from the frontend when a Pro user clicks "Manage" in Settings.
// Returns { url } which the frontend uses to redirect to Stripe's portal.
//
// Required env vars:
//   STRIPE_SECRET_KEY     — Stripe secret key
//   SUPABASE_URL          — (auto-set by Supabase)
//   SUPABASE_ANON_KEY     — (auto-set by Supabase)
//   SUPABASE_SERVICE_ROLE_KEY — (auto-set by Supabase)

import { corsHeaders } from "../_shared/cors.ts";
import { stripe } from "../_shared/stripe.ts";
import { supabaseAdmin } from "../_shared/supabase-admin.ts";
import { authenticateUser } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const auth = await authenticateUser(req);
    if ("response" in auth) return auth.response;
    const { user } = auth;

    // Get the user's Stripe customer ID
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      return new Response(JSON.stringify({ error: "No subscription found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const returnUrl = body.returnUrl || Deno.env.get("SITE_URL") || "http://localhost:5173";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: returnUrl,
    });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("create-portal error:", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
