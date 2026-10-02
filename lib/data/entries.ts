import 'server-only';
import { db, databaseError } from './db';
import { deriveEntry, metrics, type Entry, type EntryInput } from './metrics';
const columns = 'id,fund_id,period,opening_value,closing_value,inflow,outflow,net_return,return_pct,key_contributors,notes';
export async function listEntries(fundId?: string): Promise<Entry[]> {
  if (fundId && !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(fundId)) return [];
  const rows: Entry[] = [];
  // Page through PostgREST's row limit so totals and exports never truncate.
  for (let offset = 0; ; offset += 1000) {
    let query = db().from('monthly_entries').select(columns).order('period', { ascending: false }).order('id').range(offset, offset + 999);
    if (fundId) query = query.eq('fund_id', fundId);
    const { data, error } = await query; if (error) databaseError(error);
    rows.push(...(data ?? []).map(row => deriveEntry(row as Entry)));
    if (!data || data.length < 1000) return rows;
  }
}
export async function getEntry(id: string): Promise<Entry | null> {
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) return null;
  const { data, error } = await db().from('monthly_entries').select(columns).eq('id', id).maybeSingle();
  if (error) databaseError(error); return data ? deriveEntry(data as Entry) : null;
}
export async function saveEntry(input: EntryInput, id?: string) {
  const row = { ...input, ...metrics(input) };
  const query = id ? db().from('monthly_entries').update(row).eq('id', id) : db().from('monthly_entries').insert(row);
  const { error } = await query.select('id').single(); if (error) databaseError(error);
}
export async function deleteEntry(id: string) {
  const { error } = await db().from('monthly_entries').delete().eq('id', id); if (error) databaseError(error);
}
