# Action layer

All app, import, AI and system mutations enter `lib/actions/<area>.ts`. P1 will
implement the shared action context and SQL transaction boundary described here.

1. Parse untrusted input with a shared zod schema. Reject unknown write fields,
   invalid paise/teeth/dates and oversized payloads.
2. Resolve authenticated identity, current membership, org, center and timezone
   on the server. Read the existing record under RLS for edits.
3. Call `requirePermission(area, action, record)` and module/consent checks.
4. Invoke a narrow SQL transaction RPC that repeats authoritative checks, locks
   necessary records/counters, rejects stale versions, writes all rows, appends
   immutable audit events and commits together. Any failure rolls everything back.
5. Return a typed success or validation/permission/conflict/unavailable error.
   Revalidate affected views only after commit. Do not log medical payloads.

Example: booking an appointment validates patient, doctor, operatory, UTC start
and duration. The transaction verifies every referenced row belongs to the actor's
org/center and is active, checks appointment entry permission and record date,
creates the booking and initial status event, appends audit and reminder outbox
rows, and returns the ID/version. A unique org-scoped request key makes retrying a
lost response return the same booking. Reusing a key with different input fails.
No message is sent while the SQL transaction is open.

Audit records include actor, time, org/center, area, action, record ID, before/after
JSON, source (`ui`, `ai`, `import`, `system`, `support`) and correlation/idempotency
key. Source is assigned by trusted entry points. Protected identifiers are masked
or encrypted, including audit snapshots. Audit is append-only with no client
update/delete access. Permission changes and their audit share a transaction.

Multi-operation AI confirmations use one transaction, with each selected operation
validated and authorised again; they do not loop over separately committed server
actions. System jobs use an explicit, narrowly scoped system principal and audit
source, never impersonate an owner. Import batches use the same domain validation
and transactions, with stable external IDs and bounded retryable chunks.

Forms disable double-submit, preserve inputs on failure and show the offline
banner. Optimistic version checks prevent lost edits; retries use the original
request key. Soft delete and restore are explicit permission-checked actions.
Post-commit side effects use an outbox with retry state; a transport timeout is
never reported as proof that the underlying write failed.

Tests cover validation, permission denial before writes, transaction rollback on
audit failure, idempotent retry, stale edits, center/org mismatch and audit source.
No generic privileged mutation helper is exposed to clients or AI adapters.

## ACC-11 enforcement boundary (2026-10-25)

`requirePermission` resolves a fresh authenticated membership for each call. Account
password changes require that membership; login/access administration additionally
requires the protected `is_owner` flag. Existing account mutations use narrow SQL
RPCs that repeat authorization and commit their immutable audit entry atomically.
Direct authenticated writes to tenancy/account tables remain revoked.

The domain overload accepts an area, grid action and trusted record context
(org, center, persisted date and creator). It checks org equality, reads the active
center through RLS, evaluates the persisted override (defaults only for SQL NULL),
and applies Same Day in that center's timezone and edit/delete creator limits.
Malformed overrides, invalid dates, missing centers and read errors deny access.
Tests cover all five base roles, saved overrides and denied contexts.

For a new record, actions must construct this context on the server after validating
references. For edits/deletes, load it from an RLS-authorized existing record; never
pass client-supplied ownership or dates. This is an area/grid guard, not a complete
domain authorization decision. Doctor own/shared and own-treatment access, staff
contact-only fields, accountant financial-only access, appointment visibility and
module/consent restrictions must also be checked by the domain's RLS and transaction
RPC before any data is exposed or saved. No clinical or financial mutation endpoint
exists yet; introducing one requires those domain checks and isolation tests.
The server guard never substitutes for SQL authorization at commit time.
