export type Fund = { id: string; name: string; code: string; description: string | null };
export type Entry = { id: string; fund_id: string; period: string; opening_value: number; closing_value: number; inflow: number; outflow: number; net_return: number; return_pct: number; key_contributors: string | null; notes: string | null };
export type EntryInput = Omit<Entry, 'id' | 'net_return' | 'return_pct'>;
export function metrics(input: Pick<Entry, 'opening_value' | 'closing_value' | 'inflow' | 'outflow'>) {
  const cents = (n: number) => Math.round(Number(n) * 100);
  const base = cents(input.opening_value) + cents(input.inflow);
  const net = cents(input.closing_value) - base + cents(input.outflow);
  return { net_return: net / 100, return_pct: base === 0 ? 0 : Math.round(net / base * 1000000) / 10000 };
}
export function deriveEntry(row: Entry): Entry {
  const values = { ...row, opening_value: Number(row.opening_value), closing_value: Number(row.closing_value), inflow: Number(row.inflow), outflow: Number(row.outflow) };
  return { ...values, ...metrics(values) };
}
export function flags(e: Entry) {
  return [e.return_pct > 5 && 'Outstanding', e.return_pct < 0 && 'Underperforming', e.outflow > .2 * e.closing_value && 'High outflow', !e.key_contributors?.trim() && 'Missing drivers'].filter(Boolean) as string[];
}
