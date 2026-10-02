import { listFunds } from '@/lib/data/funds';
import { listEntries } from '@/lib/data/entries';
import { entriesCsv } from '@/lib/csv';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const [funds,entries] = await Promise.all([listFunds(),listEntries()]);
    return new Response(entriesCsv(entries,funds), { headers: { 'Content-Type':'text/csv; charset=utf-8', 'Content-Disposition':'attachment; filename="fund-performance.csv"', 'Cache-Control':'no-store' } });
  } catch { return Response.json({error:'Export unavailable. Please return to the dashboard and try again.'},{status:503}); }
}
