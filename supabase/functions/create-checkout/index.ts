// Creates a Stripe Checkout Session for the Pro plan.
//
// Called from the frontend when a user clicks "Upgrade to Pro".
// Returns { url } which the frontend uses to redirect to Stripe.
//
// Required env vars:
//   STRIPE_SECRET_KEY     — Stripe secret key
//   STRIPE_PRICE_ID       — Price ID for the monthly Pro plan
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

    // Check if user already has a Stripe customer ID
    const { data: subscription } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let customerId = subscription?.stripe_customer_id;

    // Create Stripe customer if needed
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabaseAdmin.from("subscriptions").upsert(
        {
          user_id: user.id,
          stripe_customer_id: customerId,
          status: "free",
        },
        { onConflict: "user_id" },
      );
    }

    const body = await req.json().catch(() => ({}));
    const returnUrl = body.returnUrl || Deno.env.get("SITE_URL") || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: Deno.env.get("STRIPE_PRICE_ID")!, quantity: 1 }],
      success_url: `${returnUrl}?checkout=success`,
      cancel_url: `${returnUrl}?checkout=cancelled`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("create-checkout error:", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
