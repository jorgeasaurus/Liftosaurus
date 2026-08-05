# Supabase Free migration plan

Status: plan only; no migration changes have been made.

## Objective

Move the one-user Liftosaurus deployment from CockroachDB to Supabase Free PostgreSQL while preserving workout history, Auth.js/GitHub login, Vercel deployment, and a safe rollback path.

## Implementation execution plan (this repo)

Branch in use: `plan/implementation-2026-08-04-175200`

### Deliverables

- [ ] Prisma provider switch and URL wiring are implemented and committed.
- [ ] PostgreSQL baseline migration is generated, reviewed, and applied to blank Supabase.
- [ ] Source export and Supabase import scripts/process are executed with parity checks.
- [ ] Preview deployment passes on Supabase-backed environment variables.
- [ ] Production cutover is completed with rollback window preserved.

### Task breakdown

1. Prisma datasource update and local validation
	 - Edit `prisma/schema/schema.prisma`: change provider to `postgresql`.
	 - Ensure `.env`/Vercel env naming keeps runtime pooled URL in `DATABASE_URL` and direct URL in `DIRECT_URL`.
	 - Run:
		 - `pnpm prisma generate`
		 - `pnpm test:unit`
		 - `pnpm check`
		 - `pnpm build`

2. Build a PostgreSQL baseline migration
	 - Generate a new migration against a clean Postgres target (Supabase direct URL):
		 - `pnpm prisma migrate dev --name init_postgres_baseline`
	 - Review generated SQL for Cockroach-specific incompatibilities before applying anywhere else.
	 - Verify migration status:
		 - `pnpm prisma migrate status`

3. Export Cockroach source and import into Supabase
	 - Freeze writes.
	 - Export source schema/data (including Auth.js tables and workout graph).
	 - Apply schema and import in dependency order.
	 - Re-run parity checks (row counts + key fields).

4. Supabase-backed preview validation
	 - Set preview env vars (`DATABASE_URL` pooled + `DIRECT_URL` direct).
	 - Deploy preview and run smoke tests for:
		 - login
		 - dashboard load
		 - workout start/edit/save
		 - progression and deload paths
		 - export and PWA route load

5. Production cutover and guarded rollback window
	 - Freeze writes, apply final delta, and re-check parity.
	 - Update Vercel production env vars to Supabase URLs.
	 - Deploy once and run smoke tests.
	 - Keep CockroachDB read-only and unchanged until explicit sign-off.

### Go/no-go gates

- Go only if all of these are true:
	- `pnpm test:unit`, `pnpm check`, and `pnpm build` pass on the migration branch.
	- Prisma migration status is clean on Supabase.
	- Source/target parity checks match expected counts and ownership.
	- Preview smoke tests pass with Supabase environment variables.
- No-go and rollback immediately if:
	- Auth.js login continuity breaks.
	- Workout history parity fails.
	- Production smoke path fails after cutover.

## Target architecture

- Keep the SvelteKit application and Vercel deployment unchanged.
- Use Supabase Free PostgreSQL as the application database.
- Keep the existing Auth.js + GitHub OAuth flow; Supabase Auth is not required.
- Use Supabase’s pooled connection for runtime traffic (`DATABASE_URL`, with `pgbouncer=true`) and a direct connection for Prisma CLI migrations (`DIRECT_URL`).
- Retain CockroachDB as read-only rollback source until cutover is accepted.

## Free-tier fit and constraints

Supabase Free provides 500 MB database storage, 1 GB file storage, 5 GB egress, 50,000 monthly active users, unlimited API requests, and two active projects. A single-user workout database should fit comfortably; measure the actual database size during migration.

Free projects with low activity may pause after roughly seven days and can be resumed within one year. This is the main operational caveat for an infrequently used personal app.

- [Supabase pricing](https://supabase.com/pricing)
- [Free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)

## Preconditions and required inputs

- Create a blank Supabase Free project, preferably in a region near the Vercel deployment and user.
- Provide the Supabase project reference and database connection details through a secure channel; never commit credentials or place them in this document.
- Confirm the project is new/empty and that CockroachDB can remain available during the rollback window.
- No new GitHub OAuth credentials are needed; the current Auth.js configuration should remain in place.
- Before the cutover, upgrade the local Vercel CLI (`pnpm add -g vercel@latest` or `npm i -g vercel@latest`).

## Phase 1: inventory and backup

- Schedule a short write-free maintenance window.
- Export the CockroachDB schema and data, including Auth.js tables, user settings, exercise splits, mesocycles/templates, workouts, exercises, sets, and minisets.
- Keep an immutable backup outside the application repository.
- Record the current app commit, migration list, Vercel environment variable names, active user identity, and source row counts.
- Do not delete or modify the CockroachDB source.

## Phase 2: PostgreSQL and Prisma compatibility

- Change the Prisma datasource provider from `cockroachdb` to `postgresql`.
- Add direct migration URL support while keeping the pooled runtime URL; Supabase transaction pooling requires the Prisma `pgbouncer=true` setting.
- Build and review a PostgreSQL baseline migration rather than assuming CockroachDB migration SQL is portable.
- Check all migrations for Cockroach-specific types, defaults, indexes, casts, and transaction behavior.
- Regenerate Prisma Client and generated Zod schemas.
- Re-test transaction retry behavior, including serialization/conflict handling, on PostgreSQL.
- Run unit tests, type checking, and a production build before importing data.

## Phase 3: provision and migrate

- Apply the reviewed PostgreSQL schema to the blank Supabase project using the direct connection.
- Import data in dependency order: users/Auth.js tables/settings; exercise splits; mesocycles and templates; workouts, exercises, sets, and minisets.
- Preserve IDs, timestamps, enum values, ownership, and relationships.
- Use a purpose-built export/import script or compatible dump/restore process; verify extensions and ownership rather than copying Cockroach-specific metadata.
- Verify foreign keys, unique constraints, indexes, and migration status after import.

## Phase 4: validation

Compare source and target row counts and verify at least:

- GitHub login continuity through the existing Auth.js user/account/session records.
- The imported five-week history: currently expected to be 21 workouts, 122 exercises, and 373 sets, subject to a fresh source count before cutover.
- Active RP mesocycle state, lifecycle/progression state, and next workout.
- Pound units, bodyweight fractions, manual-deload fields, adaptive rep ranges, and progression-variable fields.
- Ownership and source IDs with no orphaned records or cross-user mismatches.

Run `pnpm test:unit`, `pnpm check`, `pnpm build`, Prisma migration status, and targeted browser smoke tests against the Supabase-backed app. Deploy a Vercel preview with Supabase environment variables before changing production.

## Phase 5: production cutover

- Freeze writes and take a final source export or delta.
- Apply the final delta to Supabase and repeat the parity checks.
- Set Vercel Production `DATABASE_URL` to the pooled Supabase URI and `DIRECT_URL` to the direct URI; keep both values only in Vercel environment settings.
- Deploy once, then verify login, dashboard loading, workout start/edit/save, progression, adaptive/manual deload paths, export, and PWA assets.
- Keep CockroachDB untouched for the agreed rollback window.

## Rollback

- If validation or smoke tests fail, restore the Vercel database environment variables to CockroachDB and redeploy.
- Do not dual-write during the migration. If Supabase receives post-cutover writes, export and reconcile them before any rollback.
- Retire or delete the Cockroach cluster only after explicit approval, a verified Supabase backup, and a successful rollback-window review.

## Acceptance checklist

- [ ] Supabase Free project created and region selected
- [ ] Source backup/export verified
- [ ] PostgreSQL Prisma baseline reviewed
- [ ] Supabase schema applied
- [ ] Data imported with IDs and relationships preserved
- [ ] Counts, lifecycle state, units, and feature fields match
- [ ] Unit, type-check, build, and browser validation pass
- [ ] Vercel preview passes with Supabase credentials
- [ ] Production cutover and smoke tests pass
- [ ] CockroachDB retained until sign-off

## Risks and decisions

- The provider change is a real PostgreSQL migration, not a connection-string-only swap.
- Supabase Free pausing is acceptable for this one-user app but should be documented as expected behavior.
- The 500 MB database limit is currently expected to be sufficient; monitor database size and egress.
- Existing Auth.js should be retained to minimize migration scope; Supabase APIs and Supabase Auth are optional.
- Separate pooled and direct URLs are required for reliable Prisma runtime and CLI behavior on Supabase.
