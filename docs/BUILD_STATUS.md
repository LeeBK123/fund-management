# Build status — 2 October 2026

## Implemented and pushed

- Sprint 1: database access layer, fund CRUD, monthly-entry CRUD, server-derived returns, shared navigation, and the working homepage.
- Sprint 2: duplicate/validation errors, calculation regression tests, and an additive database integrity and audit migration.
- Sprint 3: consolidated dashboard with latest values, contributors, latest/all-time outflows, selectable-year YTD returns, ranking, and rule-based flags.
- Sprint 4: responsive layout, loading/error/retry states, ledger filters, CSV export, preserved form values after errors, accessible delete dialogs, activity history, and a real-database end-to-end runner.

The schema at `0001_init.sql` was preserved. `0002_integrity_and_audit.sql` corrects derived seed values, enforces first-of-month/non-negative cash constraints, recalculates metrics at the database level, expands return precision, and records changes through protected audit triggers. Activity appears when this migration is applied; CRUD still uses the original tables.

## Verified locally

- Production build with TypeScript and ESLint checks enabled: passed.
- Standalone ESLint and TypeScript checks: passed.
- Six regression tests: passed (documented calculations, cash flows, zero bases, stale derived values, ranking/YTD/empty-fund handling, flags, and CSV escaping/formula safety).
- The test-plan example calculates to **350,000 / 10,550,000 × 100 = 3.3175%**, displayed as 3.32%. The test plan's 3.30% approximation is not used.

## Pending external access — v1 acceptance is NOT complete

Vercel CLI reports no saved credentials. Device sign-in was started, but no credentials became available. Browser security review denied opening both Vercel sign-in and the local application because permission was declined. No environment secrets were invented or committed. Browser verification is also pending permission to access the application.

Therefore these checks remain pending:

1. Link the existing Vercel project and run `vercel env pull .env.local`.
2. Verify the provisioned tables and funds; apply `0001` only if the initial schema is absent, and apply the new `0002` migration through an authorized database connection.
3. Run `pnpm test:e2e` against the running app and real provisioned database. It submits actual server-rendered forms, verifies persistence and recalculation, rejects a duplicate, checks dashboard and CSV updates, checks a zero base and an empty state, and cleans up its own disposable fund.
4. Complete browser checks of the real data flow, deletion confirmation, and mobile navigation.
5. Verify Vercel deployment. Git pushes succeeded, but the public GitHub API returned no deployment/check status to confirm a live release.

No live database persistence, migration application, deployed URL, or successful live release is claimed. Auth/lock-down and AI remain later phases according to the PRD; this is the open demo workspace intended by v1.
