import 'server-only';
import { db, databaseError } from './db';
import type { Fund } from './metrics';
export async function listFunds(): Promise<Fund[]> {
  const { data, error } = await db().from('funds').select('id,name,code,description').order('name');
  if (error) databaseError(error); return data ?? [];
}
export async function getFund(id: string): Promise<Fund | null> {
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) return null;
  const { data, error } = await db().from('funds').select('id,name,code,description').eq('id', id).maybeSingle();
  if (error) databaseError(error); return data;
}
export async function saveFund(input: Omit<Fund, 'id'>, id?: string) {
  const query = id ? db().from('funds').update(input).eq('id', id) : db().from('funds').insert(input);
  const { data, error } = await query.select('id').single();
  if (error) databaseError(error); return data!.id as string;
}
export async function deleteFund(id: string) {
  const { error } = await db().from('funds').delete().eq('id', id); if (error) databaseError(error);
}
