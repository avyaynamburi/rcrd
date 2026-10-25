# Supabase types

`npm run db:types` generates `database.types.ts` from the local running database.
Generation replaces the file only after successful output, so a failed CLI command cannot erase existing types. Do not use placeholder types or hand-maintained database interfaces.

No runtime client is exposed yet. Authentication and the permission-checked action layer will be added in P1 before any application data access.
