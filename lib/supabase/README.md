# Supabase types

`npm run db:types` generates `database.types.ts` from the local running database.
Generation replaces the file only after successful output, so a failed CLI command cannot erase existing types. Do not use placeholder types or hand-maintained database interfaces.

ACC-02/03 adds the typed server-only `createAuthClient` and cookie-refresh proxy. Never import a privileged client into browser code. All account mutations enter `lib/actions/auth.ts`; login/mobile access changes repeat the owner permission check and write audit atomically in their narrow database RPC. Authentication setup and provider-owned password audit are documented in `docs/architecture/authentication.md`. Domain data and role/navigation permissions remain closed until their own action and permission implementations exist.
