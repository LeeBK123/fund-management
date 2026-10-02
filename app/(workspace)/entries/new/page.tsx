import Link from 'next/link';
import { EntryForm } from '@/components/forms';
import { listFunds } from '@/lib/data/funds';
export default async function NewEntry({searchParams}:{searchParams:Promise<{fund?:string}>}) { const [funds,query] = await Promise.all([listFunds(),searchParams]); const selected = funds.find(f => f.id === query.fund); return <><div className="page-header"><div><p className="eyebrow">MONTHLY REPORTING</p><h1>New monthly entry</h1><p className="subtitle">Record values, cash flows, and the story behind the numbers.</p></div></div>{funds.length ? <EntryForm funds={funds} fundId={selected?.id} /> : <div className="empty"><h2>Add a fund first</h2><Link href="/funds/new" className="button">Create fund</Link></div>}</>; }
