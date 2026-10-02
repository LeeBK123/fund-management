# Fund Management — Data Model

## funds
| field | type | notes |
|---|---|---|
| id | uuid PK | `gen_random_uuid()` |
| user_id | uuid | nullable — owner at lock-down |
| name | text | not null |
| code | text | not null, unique (e.g. GCF) |
| description | text | nullable |
| created_at | timestamptz | default now() |

## monthly_entries
| field | type | notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid | nullable — owner at lock-down |
| fund_id | uuid FK→funds | not null |
| period | date | first of month; unique per fund (`unique(fund_id, period)`) |
| opening_value | numeric(18,2) | not null, default 0 |
| closing_value | numeric(18,2) | not null, default 0 |
| inflow | numeric(18,2) | capital in, default 0 |
| outflow | numeric(18,2) | capital out / distributions, default 0 |
| net_return | numeric(18,2) | **computed:** closing − opening − inflow + outflow |
| return_pct | numeric(8,4) | **computed:** net_return / (opening + inflow) × 100 |
| key_contributors | text | free-text by staff (what drove performance) |
| performance_summary | text | AI-generated (later) — value |
| summary_source | text | AI-generated — source model/agent |
| summary_confidence | numeric | AI-generated — 0–1 |
| summary_review_status | text | default 'unreviewed' |
| notes | text | nullable |
| created_at | timestamptz | default now() |

## Relationships
- `monthly_entries.fund_id` → `funds.id` (many entries per fund).
- One entry per fund per month enforced by `unique(fund_id, period)`.

## Computed-field rule
`net_return` and `return_pct` are calculated in the data-access layer on write and on read (server-derived, survives refresh). Never computed client-side only.

## RLS / permissions (v1 — open demo)
- All tables: permissive select + write policies (anonymous demo).
- Lock-down sprint: replace with `auth.uid() = user_id` policies.
- AI fields: `summary_review_status` gates whether AI summary is shown to director (only 'approved' shown by default).
