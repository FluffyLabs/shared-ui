import Stripe from "https://esm.sh/stripe@17?target=deno";

export const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-04-30.basil",
  httpClient: Stripe.createFetchHttpClient(),
});
