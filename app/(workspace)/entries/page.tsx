import Link from 'next/link';
import { listEntries } from '@/lib/data/entries';
import { listFunds } from '@/lib/data/funds';
import { EntryTable } from '@/components/entry-table';
export default async function Entries() { const [entries,funds] = await Promise.all([listEntries(),listFunds()]); return <><div className="page-header"><div><p className="eyebrow">MONTHLY REPORTING</p><h1>All entries</h1><p className="subtitle">The full performance history across your portfolio.</p></div><Link href="/entries/new" className="button">＋ New entry</Link></div><section className="panel"><div className="section-heading"><h2>Performance ledger</h2><span className="muted">{entries.length} entries</span></div><EntryTable entries={entries} funds={funds} /></section></>; }
