# Build status — 2 October 2026

## Working v1

The app is running against the existing **fund-management** Supabase project (`ibrhmmvulotqybogbaph`). Its original five funds and ten monthly entries were verified and preserved. No replacement database or invented credentials were used.

Sprints 1–4 are implemented: fund and monthly-entry CRUD, server-derived returns, duplicate rejection, fund history, the consolidated dashboard, selectable-year YTD returns, rankings, performance flags, manual contributors, ledger filters, CSV export, responsive navigation, loading/error/retry states, and confirmed deletion dialogs.

## Database applied and verified

- Original `0001_init.sql` schema was already applied; it was not rerun or edited.
- `0002_integrity_and_audit.sql` was reviewed and applied on the remote database as migration `20261002062133_integrity_and_audit`. It corrected nine inconsistent seed metrics, expanded return precision, added cash/month checks and metric triggers, and installed protected audit logging. The audit trigger function is in a private schema; public application roles cannot write or truncate the audit table or truncate core tables.
- `20261002062443_consolidate_demo_policies.sql` was generated with the Supabase CLI and applied remotely as `20261002062513_consolidate_demo_policies`. It removed redundant SELECT policies and explicitly scoped shared demo access to anonymous/authenticated API roles.
- Security advisor: no findings. Performance warnings about duplicate permissive policies were resolved. The newly added activity index has an informational unused-index notice; it is retained for the latest-activity query as history grows. [Advisor explanation](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).
- The initial schema was provisioned outside migration history. Remote applied versions above are documented alongside the original repository filenames; reconcile this historical baseline before adopting automated CLI migration deployment.

## Acceptance checks passed

The production server and `scripts/e2e.mjs` used the real provisioned database and anonymous application permissions, without service-role credentials:

- Actual form submission creates a fund and edits its name, persisting on refresh.
- Actual form submission creates a monthly entry and writes 350,000 net return and 3.3175% return for the test-plan values.
- Fund detail and director overview show the persisted values and contributor note.
- A second fund/month submission returns a friendly error without creating a duplicate.
- Editing closing value recalculates and persists the return.
- CSV contains the recorded entry.
- A zero opening/inflow base saves without division failure.
- Removing this run’s disposable entries produces the empty state; its temporary fund is cleaned up.
- The PRD’s named Growth Capital Fund November 2024 entry was saved through its actual form with its existing raw values, preserving seeded data. Its dashboard card showed closing value, net return, total outflow and contributors alongside the other four funds.
- Every actual save adds an audit event, and anonymous audit-table writes are denied.

The test script removes only its own disposable fixtures. The original five funds and ten entries remain.

Production build, standalone ESLint, TypeScript and all six core regression tests passed. The test-plan example is **350,000 / 10,550,000 × 100 = 3.3175%**, displayed as 3.32%; the documentation approximation was corrected.

## Remaining release verification

The existing public Supabase URL/key were retrieved through the connected Supabase account and saved in ignored `.env.local`. Vercel CLI still has no saved credentials, so `vercel env pull .env.local` and the online deployment cannot yet be verified. Code is deployed only by Git pushes, as required; no Vercel CLI deployment was performed.

Browser access was previously declined. Automated real-form and database acceptance passed; visual/mobile navigation and confirmation-dialog browser checks remain pending renewed browser authorization. Auth/lock-down and AI remain later phases, per the PRD.
