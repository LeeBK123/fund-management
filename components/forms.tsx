'use client';
import { useActionState, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { submitEntry, submitFund, removeRecord } from '@/lib/actions/entries';
import type { Entry, Fund } from '@/lib/data/metrics';
export function EntryForm({ funds, entry, fundId }: { funds: Fund[]; entry?: Entry; fundId?: string }) {
  const [state, action, pending] = useActionState(submitEntry, {});
  const [draft,setDraft] = useState({ fund_id: entry?.fund_id ?? fundId ?? funds[0]?.id ?? '', period: entry?.period.slice(0,7) ?? '', opening_value: entry ? String(entry.opening_value) : '', closing_value: entry ? String(entry.closing_value) : '', inflow: String(entry?.inflow ?? 0), outflow: String(entry?.outflow ?? 0), key_contributors: entry?.key_contributors ?? '', notes: entry?.notes ?? '' });
  const control = (key: keyof typeof draft) => ({ value: draft[key], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setDraft(d => ({ ...d, [key]: event.target.value })) });
  return <form action={action} className="form-panel">{entry && <input type="hidden" name="id" value={entry.id} />}<div className="form-grid">
    <label>Fund<select name="fund_id" {...control('fund_id')} required>{funds.map(f => <option key={f.id} value={f.id}>{f.name} ({f.code})</option>)}</select></label>
    <label>Reporting month<input type="month" name="period" {...control('period')} min="1900-01" max="2100-12" required /></label>
    {(['opening_value','closing_value','inflow','outflow'] as const).map(key => <label key={key}>{({opening_value:'Opening value',closing_value:'Closing value',inflow:'Capital inflow',outflow:'Outflow / distributions'})[key]}<input type="number" name={key} {...control(key)} min="0" max="1000000000000" step="0.01" required placeholder="0.00" /></label>)}
    </div><p className="form-help">Net return = closing − opening − inflow + outflow. Return % uses opening value + inflow; a zero base gives 0%.</p>
    <label>Key contributors<textarea name="key_contributors" {...control('key_contributors')} rows={4} maxLength={10000} placeholder="What drove this month’s performance?" /></label>
    <label>Notes <span className="muted">(optional)</span><textarea name="notes" {...control('notes')} rows={3} maxLength={10000} /></label>
    {state.error && <p className="alert error" role="alert">{state.error}</p>}<div className="form-footer"><Link className="button secondary" href={fundId || entry ? `/funds/${entry?.fund_id ?? fundId}` : '/entries'}>Cancel</Link><button disabled={pending}>{pending ? 'Saving…' : entry ? 'Save changes' : 'Save entry'}</button></div></form>;
}
export function FundForm({ fund }: { fund?: Fund }) {
  const [state, action, pending] = useActionState(submitFund, {});
  const [draft,setDraft] = useState({name:fund?.name ?? '',code:fund?.code ?? '',description:fund?.description ?? ''});
  const control = (key: keyof typeof draft) => ({value:draft[key],onChange:(event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(d => ({...d,[key]:event.target.value}))});
  return <form action={action} className="form-panel">{fund && <input type="hidden" name="id" value={fund.id} />}<div className="form-grid"><label>Fund name<input name="name" {...control('name')} maxLength={100} required /></label><label>Fund code<input name="code" {...control('code')} maxLength={12} pattern="[A-Za-z0-9-]{1,12}" required placeholder="GCF" /></label></div><label>Description<textarea name="description" {...control('description')} rows={4} maxLength={2000} /></label>{state.error && <p className="alert error" role="alert">{state.error}</p>}<div className="form-footer"><Link className="button secondary" href={fund ? `/funds/${fund.id}` : '/'}>Cancel</Link><button disabled={pending}>{pending ? 'Saving…' : fund ? 'Save fund' : 'Create fund'}</button></div></form>;
}
export function DeleteButton({ id, kind, fundId, label }: { id: string; kind: 'entry' | 'fund'; fundId?: string; label?: string }) {
  const [open,setOpen] = useState(false), [state,action,pending] = useActionState(removeRecord, {});
  const dialog = useRef<HTMLDialogElement>(null), trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) dialog.current?.showModal(); },[open]);
  const close = () => { dialog.current?.close(); setOpen(false); trigger.current?.focus(); };
  return <><button ref={trigger} type="button" className="danger secondary small" onClick={() => setOpen(true)}>{label ?? 'Delete'}</button>{open && <dialog ref={dialog} onCancel={event => {event.preventDefault();if (!pending) close();}} aria-labelledby={`delete-${id}`} className="modal"><h2 id={`delete-${id}`}>Delete this {kind}?</h2><p>{kind === 'fund' ? 'This also deletes every monthly entry for this fund.' : 'This monthly entry will be permanently removed.'} This cannot be undone.</p><form action={action}><input type="hidden" name="id" value={id} /><input type="hidden" name="kind" value={kind} />{fundId && <input type="hidden" name="fund_id" value={fundId} />}{state.error && <p className="alert error" role="alert">{state.error}</p>}<div className="form-footer"><button type="button" className="secondary" disabled={pending} onClick={close} autoFocus>Cancel</button><button className="danger" disabled={pending}>{pending ? 'Deleting…' : `Delete ${kind}`}</button></div></form></dialog>}</>;
}
