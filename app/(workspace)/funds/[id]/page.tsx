import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFund } from '@/lib/data/funds';
import { listEntries } from '@/lib/data/entries';
import { EntryTable } from '@/components/entry-table';
import { DeleteButton } from '@/components/forms';
import { money,pct } from '@/lib/format';
export default async function FundPage({ params,searchParams }: { params: Promise<{id:string}>; searchParams: Promise<{saved?:string;deleted?:string}> }) {
  const {id} = await params; const [fund,entries,query] = await Promise.all([getFund(id),listEntries(id),searchParams]); if (!fund) notFound(); const latest = entries[0];
  return <><Link href="/" className="breadcrumb">← Overview</Link><div className="page-header"><div><p className="eyebrow">{fund.code} / FUND DETAIL</p><h1>{fund.name}</h1><p className="subtitle">{fund.description}</p></div><div className="header-actions"><Link className="button secondary" href={`/funds/${id}/edit`}>Edit fund</Link><Link className="button" href={`/entries/new?fund=${id}`}>＋ New entry</Link></div></div>{(query.saved || query.deleted) && <p className="alert success" role="status">{query.saved ? 'Changes saved.' : 'Entry deleted.'}</p>}{latest && <div className="stats three"><article><span>Latest closing value</span><strong>{money(latest.closing_value)}</strong></article><article><span>Latest net return</span><strong className={latest.net_return < 0 ? 'negative' : 'positive'}>{money(latest.net_return)} <small>{pct(latest.return_pct)}</small></strong></article><article><span>Total outflow · all months</span><strong>{money(entries.reduce((s,e) => s+e.outflow,0))}</strong></article></div>}<section className="panel"><div className="section-heading"><h2>Monthly entries</h2><span className="muted">{entries.length} records · newest first</span></div><EntryTable entries={entries} />{!entries.length && <div className="empty-cta"><Link className="button" href={`/entries/new?fund=${id}`}>＋ New entry</Link></div>}</section><div className="danger-zone"><span className="muted">Remove this fund and its monthly history</span><DeleteButton id={id} kind="fund" label="Delete fund" /></div></>;
}
