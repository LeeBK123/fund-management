import { EntryForm } from '@/components/forms';
import { listFunds } from '@/lib/data/funds';
import { getEntry } from '@/lib/data/entries';
import { notFound } from 'next/navigation';
import { month } from '@/lib/format';
export default async function EditEntry({params}:{params:Promise<{id:string}>}) { const [entry,funds] = await Promise.all([getEntry((await params).id),listFunds()]); if (!entry) notFound(); return <><div className="page-header"><div><p className="eyebrow">MONTHLY REPORTING</p><h1>Edit {month(entry.period)}</h1><p className="subtitle">Returns recalculate when you save.</p></div></div><EntryForm funds={funds} entry={entry} /></>; }
