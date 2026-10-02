'use client';
import { useActionState, useState } from 'react';
import Link from 'next/link';
import { submitEntry, submitFund, removeRecord } from '@/lib/actions/entries';
import type { Entry, Fund } from '@/lib/data/metrics';
export function EntryForm({ funds, entry, fundId }: { funds: Fund[]; entry?: Entry; fundId?: string }) {
  const [state, action, pending] = useActionState(submitEntry, {});
  return <form action={action} className="form-panel">{entry && <input type="hidden" name="id" value={entry.id} />}<div className="form-grid">
    <label>Fund<select name="fund_id" defaultValue={entry?.fund_id ?? fundId} required>{funds.map(f => <option key={f.id} value={f.id}>{f.name} ({f.code})</option>)}</select></label>
    <label>Reporting month<input type="month" name="period" defaultValue={entry?.period.slice(0,7)} min="1900-01" max="2100-12" required /></label>
    {(['opening_value','closing_value','inflow','outflow'] as const).map(key => <label key={key}>{({opening_value:'Opening value',closing_value:'Closing value',inflow:'Capital inflow',outflow:'Outflow / distributions'})[key]}<input type="number" name={key} min="0" max="1000000000000" step="0.01" required defaultValue={entry?.[key] ?? (key === 'inflow' || key === 'outflow' ? 0 : undefined)} placeholder="0.00" /></label>)}
    </div><p className="form-help">Net return = closing − opening − inflow + outflow. Return % uses opening value + inflow; a zero base gives 0%.</p>
    <label>Key contributors<textarea name="key_contributors" rows={4} maxLength={10000} defaultValue={entry?.key_contributors ?? ''} placeholder="What drove this month’s performance?" /></label>
    <label>Notes <span className="muted">(optional)</span><textarea name="notes" rows={3} maxLength={10000} defaultValue={entry?.notes ?? ''} /></label>
    {state.error && <p className="alert error" role="alert">{state.error}</p>}<div className="form-footer"><Link className="button secondary" href={fundId || entry ? `/funds/${entry?.fund_id ?? fundId}` : '/entries'}>Cancel</Link><button disabled={pending}>{pending ? 'Saving…' : entry ? 'Save changes' : 'Save entry'}</button></div></form>;
}
export function FundForm({ fund }: { fund?: Fund }) {
  const [state, action, pending] = useActionState(submitFund, {});
  return <form action={action} className="form-panel">{fund && <input type="hidden" name="id" value={fund.id} />}<div className="form-grid"><label>Fund name<input name="name" maxLength={100} required defaultValue={fund?.name} /></label><label>Fund code<input name="code" maxLength={12} pattern="[A-Za-z0-9-]{1,12}" required defaultValue={fund?.code} placeholder="GCF" /></label></div><label>Description<textarea name="description" rows={4} maxLength={2000} defaultValue={fund?.description ?? ''} /></label>{state.error && <p className="alert error" role="alert">{state.error}</p>}<div className="form-footer"><Link className="button secondary" href={fund ? `/funds/${fund.id}` : '/'}>Cancel</Link><button disabled={pending}>{pending ? 'Saving…' : fund ? 'Save fund' : 'Create fund'}</button></div></form>;
}
export function DeleteButton({ id, kind, fundId, label }: { id: string; kind: 'entry' | 'fund'; fundId?: string; label?: string }) {
  const [open,setOpen] = useState(false), [state,action,pending] = useActionState(removeRecord, {});
  return <><button type="button" className="danger secondary small" onClick={() => setOpen(true)}>{label ?? 'Delete'}</button>{open && <div className="modal-backdrop"><section role="dialog" aria-modal="true" aria-labelledby={`delete-${id}`} className="modal"><h2 id={`delete-${id}`}>Delete this {kind}?</h2><p>{kind === 'fund' ? 'This also deletes every monthly entry for this fund.' : 'This monthly entry will be permanently removed.'} This cannot be undone.</p><form action={action}><input type="hidden" name="id" value={id} /><input type="hidden" name="kind" value={kind} />{fundId && <input type="hidden" name="fund_id" value={fundId} />}{state.error && <p className="alert error" role="alert">{state.error}</p>}<div className="form-footer"><button type="button" className="secondary" disabled={pending} onClick={() => setOpen(false)} autoFocus>Cancel</button><button className="danger" disabled={pending}>{pending ? 'Deleting…' : `Delete ${kind}`}</button></div></form></section></div>}</>;
}
