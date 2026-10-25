# Supabase environments (P0-2)

Local development uses the repository-pinned Supabase CLI and Docker Desktop. Run `npm ci`, start Docker, then `npm run db:start`. The app's temporary setup screen remains available without a database; no patient data access is implemented yet.

- `npm run db:reset` resets **only the local database**, applies migrations, then configured fake seed files. Seed paths remain empty until the P1 schema/security boundary can load the P0-5 synthetic fixtures; see `supabase/seed/README.md` and BLOCKERS 3.
- `npm run db:types` generates public-schema TypeScript definitions into `lib/supabase/database.types.ts`. Failed generation preserves the existing file. Generate after each migration and commit the result with it.
- `npm run db:stop` stops the local stack without requesting deletion of its volumes.

Copy `.env.example` to `.env.local`. Obtain local URL and keys from the CLI on your machine; never paste keys into issues, documentation or commits. Only the URL and anon key may be public. The service-role key is server-only and must not be used to bypass application permissions.

No application tables or placeholder database types are introduced by P0-2. P1 will add tenancy tables, RLS helpers, isolation tests, permission checks and audit transactions together. The empty local schema still needs successful CLI type generation before P0-2 can be marked complete.

## Hosted projects: owner provisioning

Create separate staging and production projects in the owner's Supabase organisation, both explicitly in **Mumbai (`ap-south-1`)**. Do not select a different region if Mumbai is unavailable. Do not put patient data into staging.

1. Create `rcrd-staging` and `rcrd-production`; store their database passwords in the owner's password manager.
2. Verify each project's region in the dashboard before configuring any application environment.
3. Configure environment values separately for Vercel Preview (staging) and Production. Do not commit values or send them through chat.
4. Verify local migrations and fake-data tests, then use `npx supabase login` and `npx supabase link --project-ref <staging-ref>` on the owner's machine. Review `npx supabase db push --dry-run` before applying staging migrations.
5. Production rollout requires the owner; autonomous runs must never deploy it. Never run a hosted reset. Keep production backups enabled as the chosen plan permits.

No hosted connection or production deployment is configured automatically. Project creation may involve paid capacity and remains an owner task.

CLI reference: https://supabase.com/docs/guides/local-development/cli-workflows
