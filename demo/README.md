# Shared UI Demo

A minimal app that tests the Supabase integration end-to-end: authentication, subscription status, quota-gated features, and Stripe checkout.

Deployed at: https://fluffylabs.dev/shared-ui/demo/

## Local development

```bash
# From the repo root
cp .env.stripe.example .env.stripe  # or create with your values

# Set Supabase env vars
export VITE_SUPABASE_URL=https://your-project.supabase.co
export VITE_SUPABASE_ANON_KEY=your-anon-key

# Run the demo
npx vite --config demo/vite.config.ts
```

## What it tests

- **Login/Register** — AuthFlow component with email+password
- **User Menu** — compact UserMenu in the header with settings/sign-out
- **Settings** — theme selector + SubscriptionStatus with upgrade/manage buttons
- **Pricing** — PricingCard component with checkout flow
- **Quota-Gated Feature** — QuotaGate with 5 free uses/month, progress bar, and upgrade prompt
