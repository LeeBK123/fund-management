import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error('Pull the provisioned environment with vercel env pull .env.local before this check.');
const base = new URL(process.env.E2E_BASE_URL ?? 'http://localhost:3000');
const db = createClient(url,key,{auth:{persistSession:false}});
const decode = s => s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>');
async function page(path) { const res = await fetch(new URL(path,base)); assert.equal(res.status,200,`GET ${path}`); return res.text(); }
async function submit(path,values) {
  const html = await page(path), data = new FormData();
  const form = html.match(/<form\b[^>]*>([\s\S]*?)<\/form>/)?.[1];
  assert.ok(form,'Server-rendered form exists');
  for (const tag of form.match(/<input\b[^>]*>/g) ?? []) {
    if (!tag.includes('type="hidden"')) continue;
    const name = tag.match(/name="([^"]*)"/)?.[1], value = tag.match(/value="([^"]*)"/)?.[1] ?? '';
    if (name) data.set(decode(name),decode(value));
  }
  for (const [name,value] of Object.entries(values)) data.set(name,String(value));
  return fetch(new URL(path,base),{method:'POST',headers:{Origin:base.origin},body:data,redirect:'manual'});
}
let testFundId;
try {
  const {data:funds,error} = await db.from('funds').select('id,code'); assert.ifError(error);
  assert.ok(funds.some(f => f.code === 'GCF'),'Growth Capital Fund is provisioned');
  const dashboard = await page('/'); assert.ok(dashboard.includes('Growth Capital Fund'));
  const code = `QA${Date.now().toString(36).toUpperCase()}`.slice(0,12);
  const response = await submit('/funds/new',{name:'Workflow verification fund',code,description:'Disposable record created by scripts/e2e.mjs'});
  assert.equal(response.status,303,'Fund create redirects after persistence');
  testFundId = response.headers.get('location').match(/\/funds\/([0-9a-f-]{36})/)[1];
  assert.ok((await page(`/funds/${testFundId}`)).includes('No entries yet'));
  const editedFund = await submit(`/funds/${testFundId}/edit`,{id:testFundId,name:'Workflow verification fund · edited',code,description:'Disposable record created by scripts/e2e.mjs'});
  assert.equal(editedFund.status,303,'Fund edit redirects after persistence');
  assert.ok((await page(`/funds/${testFundId}`)).includes('Workflow verification fund · edited'),'Fund name persists on refresh');
  const values = {fund_id:testFundId,period:'2024-12',opening_value:10350000,closing_value:10800000,inflow:200000,outflow:100000,key_contributors:'Year-end rebalancing; gains in energy sector',notes:'Final month'};
  const saved = await submit(`/entries/new?fund=${testFundId}`,values); assert.equal(saved.status,303,'Entry create redirects');
  const {data:entry,error:readError} = await db.from('monthly_entries').select('*').eq('fund_id',testFundId).single(); assert.ifError(readError);
  assert.equal(Number(entry.net_return),350000); assert.equal(Number(entry.return_pct),3.3175);
  const detail = await page(`/funds/${testFundId}`); assert.ok(detail.includes('350,000.00')); assert.ok(detail.includes('3.32%')); assert.ok(detail.includes(values.key_contributors));
  const updatedDashboard = await page('/'); assert.ok(updatedDashboard.includes(values.key_contributors)); assert.ok(updatedDashboard.includes('Workflow verification fund'));
  const duplicate = await submit(`/entries/new?fund=${testFundId}`,values); assert.equal(duplicate.status,200); assert.ok((await duplicate.text()).includes('already exists'));
  const edited = await submit(`/entries/${entry.id}/edit`,{...values,id:entry.id,closing_value:10900000}); assert.equal(edited.status,303);
  assert.ok((await page(`/funds/${testFundId}`)).includes('450,000.00'));
  const csv = await fetch(new URL('/api/export',base)); assert.equal(csv.status,200); assert.ok((await csv.text()).includes('Year-end rebalancing; gains in energy sector'));
  const zero = await submit(`/entries/new?fund=${testFundId}`,{...values,period:'2025-01',opening_value:0,closing_value:0,inflow:0,outflow:0}); assert.equal(zero.status,303);
  const {error:deleteEntriesError} = await db.from('monthly_entries').delete().eq('fund_id',testFundId); assert.ifError(deleteEntriesError);
  assert.ok((await page(`/funds/${testFundId}`)).includes('No entries yet'));
  const {error:deleteFundError} = await db.from('funds').delete().eq('id',testFundId); assert.ifError(deleteFundError); testFundId = undefined;
  // Exercise the PRD's named fund/month using its actual existing raw values.
  // Saving identical inputs proves persistence without changing demo history.
  const gcf = funds.find(f => f.code === 'GCF');
  const {data:gcfEntry,error:gcfError} = await db.from('monthly_entries').select('*').eq('fund_id',gcf.id).eq('period','2024-11-01').single(); assert.ifError(gcfError);
  const {count:beforeAudit,error:beforeAuditError} = await db.from('audit_log').select('id',{count:'exact',head:true}).eq('target_id',gcfEntry.id).eq('action','update'); assert.ifError(beforeAuditError);
  const gcfSaved = await submit(`/entries/${gcfEntry.id}/edit`,{id:gcfEntry.id,fund_id:gcf.id,period:'2024-11',opening_value:gcfEntry.opening_value,closing_value:gcfEntry.closing_value,inflow:gcfEntry.inflow,outflow:gcfEntry.outflow,key_contributors:gcfEntry.key_contributors ?? '',notes:gcfEntry.notes ?? ''});
  assert.equal(gcfSaved.status,303,'Growth Capital Fund November save');
  const gcfDashboard = await page('/');
  for (const f of funds) assert.ok(gcfDashboard.includes(f.code),`Dashboard includes ${f.code}`);
  const gcfCard = (gcfDashboard.match(/<article\b[\s\S]*?<\/article>/g) ?? []).find(c => c.includes('>GCF<')); assert.ok(gcfCard,'GCF dashboard card exists');
  const format = n => Number(n).toLocaleString('en-MY',{minimumFractionDigits:2,maximumFractionDigits:2});
  assert.ok(decode(gcfCard).includes(gcfEntry.key_contributors),'Director sees GCF key contributors');
  assert.ok(gcfCard.includes(format(gcfEntry.closing_value)),'Director sees GCF closing value');
  assert.ok(gcfCard.includes(format(gcfEntry.net_return)),'Director sees GCF persisted net return');
  const {data:gcfHistory,error:historyError} = await db.from('monthly_entries').select('outflow').eq('fund_id',gcf.id); assert.ifError(historyError);
  assert.ok(gcfCard.includes(format(gcfHistory.reduce((sum,e)=>sum+Number(e.outflow),0))),'Director sees GCF total outflow');
  const {count:auditCount,error:auditError} = await db.from('audit_log').select('id',{count:'exact',head:true}).eq('target_id',gcfEntry.id).eq('action','update'); assert.ifError(auditError); assert.ok(auditCount > beforeAudit,'Actual entry save creates an audit event');
  console.log('PASS: actual form create/edit, database metrics, duplicate rejection, dashboard refresh, CSV, zero base, empty state, GCF November success scenario, and audit logging.');
} finally {
  // Only remove the disposable fund created by this run. Existing funds are untouched.
  if (testFundId) { const {error} = await db.from('funds').delete().eq('id',testFundId); if (error) console.error('Cleanup failed for disposable fund',testFundId); }
}
