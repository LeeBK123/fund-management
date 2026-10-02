# Fund Management — Tasks

## Sprint 1 — Database + Fund CRUD
**Goal:** DB schema live; funds table seeded and editable.
- [ ] Run migration SQL (funds + monthly_entries tables, RLS permissive policies, seed 5 funds).
- [ ] `lib/data/funds.ts` — list, getById, create, update, delete.
- [ ] Fund list page + fund detail page (empty/loading/error/ready states).
- [ ] Sidebar nav with 5 fund links.
**DoD:** 5 funds render on dashboard without login; can edit a fund name and see it persist.

## Sprint 2 — Monthly Entry CRUD (core engine) ★ v1 functional milestone
**Goal:** Staff can key in monthly performance; it persists and shows up.
- [ ] `lib/data/entries.ts` — list by fund, create, update, delete; compute net_return + return_pct server-side.
- [ ] `lib/actions/entries.ts` — server actions for create/update/delete.
- [ ] Fund detail page: entries table sorted by period desc + "New entry" button.
- [ ] Entry form: period, opening, closing, inflow, outflow, key_contributors, notes.
- [ ] Duplicate fund+period rejected (DB unique constraint → friendly UI error).
- [ ] Seed ~12 monthly entries across 5 funds.
**DoD:** Success scenario — staff enters Nov 2024 entry for Growth Capital Fund; it appears in fund detail and dashboard. No dead buttons.

## Sprint 3 — Consolidated Dashboard
**Goal:** Director sees all 5 funds side-by-side with key contributors.
- [ ] Dashboard page: per-fund card (latest month value, net return, return %, total outflow, key-contributors snippet).
- [ ] YTD net return per fund + total across funds.
- [ ] Rank funds by latest return_pct; highlight top fund.
- [ ] Rule-based flags (outstanding / underperforming / high_outflow / missing_drivers) as badges.
- [ ] Empty state when no entries exist for a fund.
**DoD:** Director opens dashboard, sees all 5 funds, latest-month numbers, key contributors, and top performer — from real (seeded + user-entered) data.

## Sprint 4 — Polish + Export
**Goal:** Usable internal tool.
- [ ] Responsive: sidebar collapses to hamburger on mobile.
- [ ] Loading skeletons + error retry on all pages.
- [ ] Simple CSV export of all entries (director).
- [ ] Test plan executed end-to-end.
**DoD:** App works on mobile; CSV export produces correct rows; all test-plan steps pass.

## Sprint 5 — Lock it down (auth + RLS)
**Goal:** Per-user isolation before real data.
- [ ] Supabase auth (login/signup pages).
- [ ] Replace permissive RLS with `auth.uid() = user_id`; director role sees all.
- [ ] `user_id` populated on create.
- [ ] Audit log table + logging on create/update/delete.
**DoD:** Anonymous can't see data; logged-in user sees only their funds; director sees all.

## Sprint 6 — Intelligence (later)
- [ ] `lib/ai/summary.ts` — generate performance_summary per entry.
- [ ] Review workflow (approve/reject AI summary before it surfaces).
- [ ] Audit log for summary generation + publish.

## Gantt
```
S1  S2  S3  S4  S5  S6
DB  --- --- --- --- ---
    ENT --- --- --- ---
        DSH --- --- ---
            POL --- ---
                LCK ---
                    AI-
```
S1 = DB+Funds · S2 = Entries ★v1 · S3 = Dashboard · S4 = Polish · S5 = Lock-down · S6 = Intelligence
