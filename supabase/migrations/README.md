# Database migrations

Create timestamped SQL migrations with `npx supabase migration new <name>`.
ACC-01 supplies the initial read-only tenancy migration and `tests/rls/tenancy.sql`. CI run 40180232194 verified migration reset, 82 isolation assertions and type generation; local Docker remains blocked (BLOCKERS 1). Audited write RPCs and area permissions arrive in later access features; no application mutations are granted. Never add a patient or clinic table without RLS and isolation tests.

Apply and verify locally with `npm run db:reset`, then `npm run db:types`.
Commit migrations and the resulting `lib/supabase/database.types.ts` together.
Do not edit generated types by hand or run reset against a hosted project.
Hosted migration rollout is an owner-controlled operation until a reviewed staging pipeline exists.
