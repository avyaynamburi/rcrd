# Synthetic demo fixture (P0-5, database loading blocked)

Run `npm run db:seed:preview` to inspect the deterministic fixture. It produces one
fictional organisation, two centers, five doctors, three staff and twelve fake
patients. IDs remain stable across runs. No contact details, credentials, real
clinic records or imported data are used. Logins are disabled and all patient
consents are false. The command only prints JSON; it does not connect to a database.

Database loading is deliberately unfinished: there is no application schema yet
and Docker/storage recovery is BLOCKERS 1. P1 introduces tenancy, permission and
audit transactions before any application records can be persisted. Keep P0-5
blocked until `npm run db:reset` can load these fixtures through a restricted,
transactional seed action with an audit entry, repeat safely, and pass isolation
tests. Wire that SQL into `db.seed.sql_paths` at that point. Do not create a
parallel unprotected patient schema or seed hosted projects.

`defaults/` is reserved for versioned specification master lists, distinct from
the demo clinic. Apply defaults to each new organisation through provisioning;
do not copy demo patients or staff into new customer organisations.
