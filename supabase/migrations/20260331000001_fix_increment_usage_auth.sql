-- Fix: validate caller identity in increment_usage to prevent
-- one user from incrementing another user's quota.
create or replace function increment_usage(
  p_user_id uuid,
  p_app_id text,
  p_action text,
  p_period text
) returns int as $$
declare
  new_count int;
begin
  -- Ensure caller can only increment their own usage
  if p_user_id != auth.uid() then
    raise exception 'Access denied: cannot modify another user''s usage';
  end if;

  insert into usage (user_id, app_id, action, period, count)
  values (p_user_id, p_app_id, p_action, p_period, 1)
  on conflict (user_id, app_id, action, period)
  do update set count = usage.count + 1
  returning count into new_count;
  return new_count;
end;
$$ language plpgsql security definer;
