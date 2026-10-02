-- The ALL policies already include SELECT. Remove redundant read policies
-- and scope the shared demo explicitly to the two application API roles.
drop policy funds_v1_read on public.funds;
drop policy monthly_entries_v1_read on public.monthly_entries;
alter policy funds_v1_write on public.funds to anon, authenticated;
alter policy monthly_entries_v1_write on public.monthly_entries to anon, authenticated;
