-- Additive follow-up: preserve 0001 and the provisioned tables.
begin;
alter table public.monthly_entries alter column return_pct type numeric(20,4);
alter table public.monthly_entries add constraint entry_month_start check (extract(day from period) = 1) not valid;
alter table public.monthly_entries add constraint entry_nonnegative_cash check (opening_value >= 0 and closing_value >= 0 and inflow >= 0 and outflow >= 0) not valid;
alter table public.monthly_entries validate constraint entry_month_start;
alter table public.monthly_entries validate constraint entry_nonnegative_cash;

create or replace function public.compute_entry_metrics() returns trigger
language plpgsql set search_path = public as $$
begin
  new.net_return := new.closing_value - new.opening_value - new.inflow + new.outflow;
  new.return_pct := case when new.opening_value + new.inflow = 0 then 0
    else round(new.net_return / (new.opening_value + new.inflow) * 100, 4) end;
  return new;
end;
$$;
create trigger compute_entry_metrics before insert or update on public.monthly_entries
for each row execute function public.compute_entry_metrics();
-- Fix seeded derived values without changing any underlying values or notes.
update public.monthly_entries set net_return = closing_value - opening_value - inflow + outflow,
  return_pct = case when opening_value + inflow = 0 then 0
    else round((closing_value - opening_value - inflow + outflow) / (opening_value + inflow) * 100, 4) end;

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  actor_user_id uuid,
  target_table text not null,
  target_id uuid not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;
create policy audit_v1_read on public.audit_log for select to anon, authenticated using (true);
revoke all on public.audit_log from anon, authenticated;
grant select on public.audit_log to anon, authenticated;
create index audit_log_created_at_idx on public.audit_log(created_at desc);
-- Application roles require CRUD only, not TRUNCATE or trigger management.
revoke truncate, references, trigger on public.funds, public.monthly_entries from anon, authenticated;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
-- Called only by triggers after source-table RLS has authorized a write.
-- The v1 anonymous demo intentionally records a null actor_user_id.
create or replace function private.log_fund_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_log(action,actor_user_id,target_table,target_id,detail)
  values(lower(tg_op),auth.uid(),tg_table_name,coalesce(new.id,old.id),
    jsonb_build_object('before',case when tg_op <> 'INSERT' then to_jsonb(old) else null end,
      'after',case when tg_op <> 'DELETE' then to_jsonb(new) else null end));
  return coalesce(new,old);
end;
$$;
revoke all on function private.log_fund_change() from public, anon, authenticated;
create trigger audit_funds after insert or update or delete on public.funds
for each row execute function private.log_fund_change();
create trigger audit_entries after insert or update or delete on public.monthly_entries
for each row execute function private.log_fund_change();
commit;
