# Fund Management — Architecture

## Stack
Next.js (App Router) · Supabase (Postgres) · Vercel deploy.

## Build sequence
**Now (v1):** Fund CRUD + monthly-entry CRUD (core engine) + consolidated dashboard. Viewable without login; seeded demo data.
**Next:** AI-generated performance summaries per entry; trend charts per fund; exportable director report.
**Later:** Auth + per-user RLS lock-down; automated import; benchmark comparison.

## Key user-action flow (staff logs a month)
1. Staff opens Dashboard → sees 5 funds.
2. Clicks a fund → fund detail shows monthly entries table.
3. Clicks "New entry" → form: period, opening, closing, inflow, outflow, key contributors, notes.
4. On submit → `monthly_entries` row inserted (net_return & return_pct computed server-side).
5. Dashboard + fund detail refresh to show the new row; duplicate fund+period rejected by DB unique constraint.

## Responsive nav shell
Persistent left sidebar (desktop): Dashboard, Fund 1–5 quick links, All Entries. Collapses to hamburger on mobile. Current section highlighted.

## Layer plan
1. **Data layer** (`lib/data/`) — all Supabase reads/writes; computed fields (net_return, return_pct) calculated here, never in UI.
2. **App logic** (`lib/actions/`) — server actions for create/update/delete entries.
3. **UI** (`app/`, `components/`) — screens consume data layer only.
4. **Intelligence** (`lib/ai/`) — later: auto-summarise key contributors from numbers + notes.

## Why core runs without AI
All v1 features are pure CRUD + arithmetic (net_return = closing − opening − inflow + outflow). No AI dependency. Intelligence is additive, layered on top of stored data.

## Repo structure
```
lib/data/funds.ts        # fund queries
lib/data/entries.ts     # monthly-entry queries + computed fields
lib/actions/entries.ts   # server actions: create/update/delete
lib/ai/summary.ts        # later — AI key-contributor summary
app/dashboard/page.tsx
app/funds/[id]/page.tsx
app/entries/new/page.tsx
components/             # shared UI
__tests__/              # beside code
```

## Module map
| Module | Responsibility | Owns | Build order |
|---|---|---|---|
| **funds** | Fund CRUD | `funds` table | 1 |
| **entries** (core engine) | Monthly-entry CRUD + computed metrics | `monthly_entries` table | 2 |
| **dashboard** | Aggregated cross-fund view | reads funds + entries | 3 |
| **intelligence** | AI performance summaries | reads entries, writes summary fields | 4 |
| **auth** | Login + per-user RLS | auth + RLS policies | 5 |
