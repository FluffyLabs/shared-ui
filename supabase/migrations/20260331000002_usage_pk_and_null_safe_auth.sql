-- Replace unique constraint with primary key on usage table
alter table usage drop constraint if exists usage_user_id_app_id_action_period_key;
alter table usage add primary key (user_id, app_id, action, period);

-- Fix NULL-safe auth check in increment_usage
-- (p_user_id != NULL evaluates to NULL, bypassing the guard)
create or replace function increment_usage(
  p_user_id uuid,
  p_app_id text,
  p_action text,
  p_period text
) returns int as $$
declare
  new_count int;
begin
  if auth.uid() is null or p_user_id is distinct from auth.uid() then
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
