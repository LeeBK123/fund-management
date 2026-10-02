import type { Entry,Fund } from './data/metrics';
function cell(value: unknown) {
  let text = String(value ?? '');
  // Prevent spreadsheet formula execution in user-entered text, retaining numbers.
  if (typeof value === 'string' && /^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"','""')}"`;
}
export function entriesCsv(entries: Entry[], funds: Fund[]) {
  const header = ['Fund code','Fund name','Period','Opening value','Closing value','Inflow','Outflow','Net return','Return %','Key contributors','Notes'];
  const rows = entries.map(e => { const fund = funds.find(f => f.id === e.fund_id); return [fund?.code, fund?.name, e.period, e.opening_value, e.closing_value, e.inflow, e.outflow, e.net_return, e.return_pct, e.key_contributors, e.notes].map(cell).join(','); });
  return '\uFEFF' + [header.map(cell).join(','),...rows].join('\r\n') + '\r\n';
}
