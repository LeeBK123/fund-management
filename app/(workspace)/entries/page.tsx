import Link from 'next/link';
import { listEntries } from '@/lib/data/entries';
import { listFunds } from '@/lib/data/funds';
import { EntryTable } from '@/components/entry-table';
import { recentActivity } from '@/lib/data/audit';
export default async function Entries({searchParams}:{searchParams:Promise<{fund?:string;year?:string}>}) {
  const [entries,funds,query,activity] = await Promise.all([listEntries(),listFunds(),searchParams,recentActivity()]);
  const years = [...new Set(entries.map(e => e.period.slice(0,4)))].sort().reverse();
  const selectedFund = funds.some(f => f.id === query.fund) ? query.fund : '';
  const selectedYear = years.includes(query.year ?? '') ? query.year : '';
  const filtered = entries.filter(e => (!selectedFund || e.fund_id === selectedFund) && (!selectedYear || e.period.startsWith(selectedYear)));
  return <><div className="page-header"><div><p className="eyebrow">MONTHLY REPORTING</p><h1>All entries</h1><p className="subtitle">The full performance history across your portfolio.</p></div><div className="header-actions"><a className="button secondary" href="/api/export">↓ Export all CSV</a><Link href="/entries/new" className="button">＋ New entry</Link></div></div><form className="ledger-filters"><label>Fund<select name="fund" defaultValue={selectedFund}><option value="">All funds</option>{funds.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></label><label>Year<select name="year" defaultValue={selectedYear}><option value="">All years</option>{years.map(y => <option key={y}>{y}</option>)}</select></label><button className="secondary">Filter entries</button>{(selectedFund || selectedYear) && <Link href="/entries" className="text-link">Clear filters</Link>}</form><section className="panel"><div className="section-heading"><h2>Performance ledger</h2><span className="muted">{filtered.length} of {entries.length} entries</span></div><EntryTable entries={filtered} funds={funds} /></section>
  {activity && <section className="panel activity-panel"><div className="section-heading"><h2>Recent activity</h2><span className="muted">Latest 15 changes · shared demo</span></div>{!activity.length && <p className="muted">No changes recorded yet.</p>}<ul>{activity.map(a => <li key={a.id}><div><strong>{a.action === 'insert' ? 'Created' : a.action === 'delete' ? 'Deleted' : 'Updated'} {a.target_table === 'funds' ? 'fund' : 'entry'}</strong><span>{a.detail.after?.name ?? a.detail.before?.name ?? a.detail.after?.period ?? a.detail.before?.period ?? a.target_id}</span></div><time dateTime={a.created_at}>{new Date(a.created_at).toLocaleString('en-MY',{timeZone:'Asia/Kuala_Lumpur',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})} MYT</time></li>)}</ul></section>}</>;
}
