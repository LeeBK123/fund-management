# Fund Management — Intelligence Layer

## Messy inputs
Staff free-text `key_contributors` varies wildly — terse notes, multi-sentence explanations, or empty. Raw numbers (inflow/outflow/return) are structured but lack narrative.

## Auto-structure schema (later)
```json
{
  "fund_code": "GCF",
  "period": "2024-11",
  "net_return": 350000,
  "return_pct": 3.5,
  "drivers": [
    { "label": "Tech equity rally", "impact": "positive", "magnitude": "high" },
    { "label": "FX headwind", "impact": "negative", "magnitude": "low" }
  ],
  "one_line_summary": "Tech rally drove +3.5% return; minor FX drag."
}
```
Stored as `performance_summary` (text) + `summary_source` + `summary_confidence`.

## Events to track
- Entry created / updated / deleted.
- AI summary generated.
- Summary reviewed (approved / rejected / edited).
- Dashboard viewed (director session).

## Scoring rules (rule-based, v1 later)
- `return_pct > 5` → performance flag: `outstanding`
- `return_pct < 0` → flag: `underperforming`
- `outflow > 0.2 × closing_value` → flag: `high_outflow`
- `key_contributors` empty → flag: `missing_drivers`
Flags surfaced on dashboard as badges per fund.

## What gets ranked
Director dashboard ranks funds by latest-month `return_pct` desc and highlights top contributor fund.

## v1 vs later
- **v1:** No AI. Manual `key_contributors` text + rule-based flags shown on dashboard.
- **Later:** AI generates `performance_summary` from numbers + key_contributors; director reviews/approves before it surfaces.
