# Fund Management — Agentic Layer

## Draftable actions (low risk — auto)
- Generate `performance_summary` from entry numbers + key_contributors text → saved as draft with `summary_review_status = 'unreviewed'`.
- Tag entries with performance flags (outstanding / underperforming / high_outflow).

## Executable-after-approval actions (medium risk)
- Publish an AI-generated summary to the director dashboard (`summary_review_status → 'approved'`).
- Create a draft monthly entry from a partial data prompt (staff confirms before save).

## Human-only actions (critical)
- Delete a monthly entry.
- Edit `closing_value` or `outflow` after a month is finalised.
- Delete a fund.

## Named tools
- `summarise_entry(entry_id)` — reads one entry, returns summary text. Low risk, auto.
- `publish_summary(entry_id)` — flips review_status to approved. Medium risk, requires approval.
- `draft_entry(fund_id, period, partial_data)` — returns pre-filled entry object. Medium risk.
- `delete_entry(entry_id)` — human-only, no agent access.

## Audit-log fields
`action`, `actor_user_id`, `target_table`, `target_id`, `detail (jsonb)`, `created_at`.
Every publish/draft/delete is logged.

## v1 vs later
- **v1:** No agentic actions. All data is manual entry by staff.
- **Later:** `summarise_entry` + `publish_summary` + `draft_entry` with audit logging.
