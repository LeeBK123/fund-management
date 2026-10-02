# Fund Management — PRD

## Problem
Finance staff track monthly portfolio performance and outflows across **5 separate investment funds** with no consolidated view. The finance director has no quick way to see overall performance and identify key contributors per fund per month.

## Target user
- **Primary (v1):** Finance/admin staff who key in monthly performance per fund.
- **Reviewer (v1):** Finance director who reviews aggregated performance and key contributors.

## Core objects
- **Fund** — one of 5 investment funds (name, code, description).
- **MonthlyEntry** — one record per fund per month: opening value, closing value, inflow, outflow, net return, return %, key contributors (free text), notes.

## MVP (v1) checklist
- [ ] 5 funds seeded and editable.
- [ ] Staff can create / edit / delete a monthly entry for any fund for a given month.
- [ ] Duplicate month+fund prevented.
- [ ] Per-fund detail view showing monthly entries sorted by period.
- [ ] Dashboard: all 5 funds side-by-side, latest month values + net return, YTD net return, total outflow.
- [ ] Key-contributors text visible and editable per entry; highlighted on dashboard.
- [ ] Empty / loading / error states handled on every screen.

## Non-goals (v1)
- Login/auth (later lock-down sprint).
- Multi-currency conversion.
- Fund-level benchmark comparison vs market indices.
- Automated data import / API feeds.
- AI-generated summaries (later phase).
- Notifications / alerts.

## Success criteria
Finance staff enters November 2024 closing value, inflow, outflow, and key-contributors text for the Growth Capital Fund. The director opens the dashboard and sees the updated fund's latest-month net return, total outflow, and key-contributors note — alongside the other 4 funds — without leaving the page. One end-to-end pass = success.
