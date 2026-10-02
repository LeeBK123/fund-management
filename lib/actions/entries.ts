'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveEntry, deleteEntry } from '@/lib/data/entries';
import { saveFund, deleteFund } from '@/lib/data/funds';
export type FormState = { error?: string };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function idValue(v: FormDataEntryValue | null) { if (typeof v !== 'string' || !uuid.test(v)) throw new Error('Choose a valid record.'); return v; }
function text(data: FormData, key: string, max = 10000) { const v = String(data.get(key) ?? '').trim(); if (v.length > max) throw new Error(`${key.replaceAll('_', ' ')} is too long.`); return v; }
function amount(data: FormData, key: string) {
  const raw = text(data, key, 30);
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) throw new Error('Enter non-negative amounts with at most two decimal places.');
  const v = Number(raw); if (!Number.isFinite(v) || v > 1000000000000) throw new Error('Amounts must be between 0 and 1,000,000,000,000.'); return v;
}
function refresh() { revalidatePath('/', 'layout'); }
export async function submitEntry(_: FormState, data: FormData): Promise<FormState> {
  let fundId: string;
  try {
    fundId = idValue(data.get('fund_id'));
    const period = text(data, 'period', 7);
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period) || Number(period.slice(0,4)) < 1900 || Number(period.slice(0,4)) > 2100) throw new Error('Choose a month between 1900 and 2100.');
    await saveEntry({ fund_id: fundId, period: `${period}-01`, opening_value: amount(data,'opening_value'), closing_value: amount(data,'closing_value'), inflow: amount(data,'inflow'), outflow: amount(data,'outflow'), key_contributors: text(data,'key_contributors'), notes: text(data,'notes') }, data.get('id') ? idValue(data.get('id')) : undefined);
  } catch (e) { return { error: e instanceof Error ? e.message : 'Could not save the entry.' }; }
  refresh(); redirect(`/funds/${fundId}?saved=entry`);
}
export async function submitFund(_: FormState, data: FormData): Promise<FormState> {
  let id: string;
  try {
    const name = text(data,'name',100), code = text(data,'code',12).toUpperCase();
    if (!name || !/^[A-Z0-9-]{1,12}$/.test(code)) throw new Error('Enter a fund name and a code using letters, numbers, or hyphens.');
    id = await saveFund({ name, code, description: text(data,'description',2000) }, data.get('id') ? idValue(data.get('id')) : undefined);
  } catch (e) { return { error: e instanceof Error ? e.message : 'Could not save the fund.' }; }
  refresh(); redirect(`/funds/${id}?saved=fund`);
}
export async function removeRecord(_: FormState, data: FormData): Promise<FormState> {
  let destination = '/';
  try {
    const id = idValue(data.get('id'));
    if (data.get('kind') === 'entry') { const fundId = idValue(data.get('fund_id')); await deleteEntry(id); destination = `/funds/${fundId}?deleted=entry`; }
    else if (data.get('kind') === 'fund') { await deleteFund(id); destination = '/?deleted=fund'; }
    else throw new Error('Invalid record type.');
  } catch (e) { return { error: e instanceof Error ? e.message : 'Could not delete this record.' }; }
  refresh(); redirect(destination);
}
