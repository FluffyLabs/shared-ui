// Handles Stripe webhook events to update subscription status.
//
// Stripe sends events here when subscriptions are created, updated, or cancelled.
// This function verifies the webhook signature and updates the `subscriptions` table.
//
// Required env vars:
//   STRIPE_SECRET_KEY        — Stripe secret key
//   STRIPE_WEBHOOK_SECRET    — Webhook signing secret (from Stripe Dashboard > Webhooks)
//   SUPABASE_URL             — (auto-set by Supabase)
//   SUPABASE_SERVICE_ROLE_KEY — (auto-set by Supabase)
//
// Stripe webhook events to subscribe to:
//   - checkout.session.completed
//   - customer.subscription.updated
//   - customer.subscription.deleted

import Stripe from "https://esm.sh/stripe@17?target=deno";
import { stripe } from "../_shared/stripe.ts";
import { supabaseAdmin } from "../_shared/supabase-admin.ts";

Deno.serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  if (!signature) {
    return new Response("Missing Stripe-Signature header", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.customer || !session.subscription) break;

        const customerId = typeof session.customer === "string" ? session.customer : session.customer.id;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : session.subscription.id;

        // Fetch the full subscription to get period end
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "active",
            stripe_subscription_id: subscriptionId,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const status = sub.status === "active" ? "active" : "cancelled";

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "cancelled",
            current_period_end: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    console.error("stripe-webhook error:", err);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
