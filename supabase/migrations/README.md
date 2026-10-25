# Database migrations

Create timestamped SQL migrations with `npx supabase migration new <name>`.
No application tables exist yet. Tenancy, RLS helpers and audit arrive with ACC-01/ACC-11; never add a patient or clinic table without RLS and isolation tests.

Apply and verify locally with `npm run db:reset`, then `npm run db:types`.
Commit migrations and the resulting `lib/supabase/database.types.ts` together.
Do not edit generated types by hand or run reset against a hosted project.
Hosted migration rollout is an owner-controlled operation until a reviewed staging pipeline exists.
