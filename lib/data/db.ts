import 'server-only';
import { createClient } from '@supabase/supabase-js';
export function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Database configuration is unavailable.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) } });
}
export function databaseError(error: { code?: string; message: string }): never {
  if (error.code === '23505') throw new Error('That fund code or fund/month already exists. Please edit the existing record.');
  if (error.code === '23503') throw new Error('This fund no longer exists. Refresh and choose another fund.');
  throw new Error('The database could not complete this request. Please try again.');
}
