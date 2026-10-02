# Fund Management — Security

## Secret handling
- Supabase service key only in server actions / data layer — never shipped to client.
- Client uses anon key (public read/write during demo phase).
- No secrets in `.env` committed; `.env.local` only.

## Permission model
- **v1 (demo):** Open permissive RLS — anonymous can read/write all rows. Seeded demo data is viewable without login.
- **Lock-down (later):** Replace permissive policies with `auth.uid() = user_id` on all tables. Only the owning user sees/edits their funds and entries. Director role sees all.
- Agent inherits the logged-in user's permissions — never runs with service-role key for user-facing actions.

## Approved-tools rule
- Agents may only call named tools (`summarise_entry`, `publish_summary`, `draft_entry`).
- No raw `run_any` / `send_any` / arbitrary SQL execution.
- `delete_entry` and fund deletion are human-only — no agent path exists.

## Audit principle
Every meaningful action (create/update/delete entry, publish AI summary) writes an audit_log row with actor, target, and detail. Director can see a simple action history.
