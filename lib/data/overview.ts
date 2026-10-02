import type { Fund, Entry } from './metrics';
import { flags } from './metrics';
export function overview(funds: Fund[], entries: Entry[], year: number) {
  const cards = funds.map(fund => {
    const history = entries.filter(e => e.fund_id === fund.id).sort((a,b) => b.period.localeCompare(a.period));
    const annual = history.filter(e => Number(e.period.slice(0,4)) === year);
    return { fund, latest: history[0], ytd: annual.reduce((s,e) => s + e.net_return,0), outflow: history.reduce((s,e) => s + e.outflow,0), flags: history[0] ? flags(history[0]) : [] };
  }).sort((a,b) => (b.latest?.return_pct ?? -Infinity) - (a.latest?.return_pct ?? -Infinity) || a.fund.name.localeCompare(b.fund.name));
  return { cards, closing: cards.reduce((s,c) => s + (c.latest?.closing_value ?? 0),0), latestReturn: cards.reduce((s,c) => s + (c.latest?.net_return ?? 0),0), ytd: cards.reduce((s,c) => s + c.ytd,0), outflow: cards.reduce((s,c) => s + c.outflow,0) };
}
