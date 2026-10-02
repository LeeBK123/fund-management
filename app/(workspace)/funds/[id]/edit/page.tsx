import { FundForm } from '@/components/forms';
import { getFund } from '@/lib/data/funds';
import { notFound } from 'next/navigation';
export default async function EditFund({params}:{params:Promise<{id:string}>}) { const fund = await getFund((await params).id); if (!fund) notFound(); return <><div className="page-header"><div><p className="eyebrow">FUND SETUP</p><h1>Edit {fund.code}</h1><p className="subtitle">Update fund information.</p></div></div><FundForm fund={fund} /></>; }
