-- user_data table (per-user key-value storage)
create table if not exists user_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  app_id text not null default '',
  key text not null,
  value jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, app_id, key)
);

alter table user_data enable row level security;

create policy "Users can manage their own data"
  on user_data for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- subscriptions table (managed by Stripe webhooks)
create table if not exists subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table subscriptions enable row level security;

create policy "Users can read their own subscription"
  on subscriptions for select
  using (auth.uid() = user_id);

-- usage table (rate limiting for free plan)
create table if not exists usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  app_id text not null default '',
  action text not null,
  period text not null,
  count int not null default 0,
  unique (user_id, app_id, action, period)
);

alter table usage enable row level security;

create policy "Users can read their own usage"
  on usage for select
  using (auth.uid() = user_id);

-- Atomic increment function (called by useQuota hook)
create or replace function increment_usage(
  p_user_id uuid,
  p_app_id text,
  p_action text,
  p_period text
) returns int as $$
declare
  new_count int;
begin
  insert into usage (user_id, app_id, action, period, count)
  values (p_user_id, p_app_id, p_action, p_period, 1)
  on conflict (user_id, app_id, action, period)
  do update set count = usage.count + 1
  returning count into new_count;
  return new_count;
end;
$$ language plpgsql security definer;
