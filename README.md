# Fund Management

A shared demo workspace for staff to log monthly fund performance and for a finance director to review consolidated results. The homepage is the app; no login is required in v1.

## Core workflow

Open a fund, select **New entry**, record a month’s opening/closing values, inflow/outflow, contributors and notes, then save. The entry persists in Supabase, returns recalculate on the server, and the fund detail and overview refresh. Existing entries and fund details can be edited or deleted through confirmation dialogs.

The overview ranks each fund’s latest month and shows contributors, closing value, net return, latest outflow, all-time outflow and selected-year YTD return. Each latest month is labelled; a mixed-month portfolio snapshot is explicit. CSV exports all recorded entries and neutralizes spreadsheet formulas in text fields. All Entries supports fund/year filters and shows audit activity once the audit migration is applied.

## Local setup

Use Node.js 22 or newer and the pinned pnpm package manager.

```sh
pnpm install
vercel login
vercel link --project fund-management
vercel env pull .env.local
pnpm dev
```

Use the existing provisioned Supabase project. Environment files and `.vercel` are ignored by Git. The public anonymous key is used by the server data layer under the demo RLS policies; service-role credentials are never used in the client or for application writes.

## Database

`supabase/migrations/0001_init.sql` contains the original tables and demo seeds. Verify whether it is already applied before running it. Do not recreate existing tables or edit this migration.

Apply `0002_integrity_and_audit.sql` through an authorized Supabase/Postgres administration connection. It is transactional and preserves the original raw values and contributors. It corrects stale derived seed figures, adds metric triggers and validation, expands return precision and records CRUD activity. The application also calculates metrics on read and write, so the original schema can serve the core workflow while this additive migration is pending.

Net return = closing − opening − inflow + outflow. Return % = net return / (opening + inflow) × 100, or zero when the base is zero. Cash inputs accept non-negative values with two decimal places and a maximum of 1 trillion per field.

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm start
# In another terminal, using the real provisioned environment:
pnpm test:e2e
```

The end-to-end check defaults to http://localhost:3000. Set `E2E_BASE_URL` to an authorized deployed application URL when testing a deployment that uses the same Supabase environment. It creates a uniquely coded disposable fund, submits real forms, checks persistence, dashboard updates, duplicate prevention, edits, exports and zero-base handling, then removes only its own fixture.

Deploy by committing and pushing to `main`; Vercel should build from GitHub. Do not deploy local files with the Vercel CLI.

See [docs/BUILD_STATUS.md](docs/BUILD_STATUS.md) for verified checks and outstanding acceptance work, and the rest of `/docs` for the PRD, model and later auth/AI phases. Keep real/private financial data out of the public demo until the lock-down sprint.
