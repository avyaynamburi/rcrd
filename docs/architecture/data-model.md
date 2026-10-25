# Data model

This is the implementation plan for P1 onward, not a claim that these tables exist.
The current app has no application schema. Migrations and generated public types
ship with the owning feature; fake seed loading remains blocked (BLOCKERS 3).

## Ownership and keys

Platform → organisation → center → operatory. Organisation rows have `org_id = id`.
Every application table has `id uuid`, `org_id`, `created_by/at`, `updated_by/at`,
`deleted_at`, and nullable `external_source/id`. Branch records also have
`center_id`. Composite foreign keys `(org_id, parent_id)` and
`(org_id, center_id)` prevent cross-tenant links even for privileged writes.
Branch-specific parent links also match center. Index tenant/filter columns;
uniqueness includes org and, where appropriate, center. Import external keys are
unique per org, source and entity type. Auth identities live in Supabase Auth;
application memberships link their user UUID without copying passwords.

## Feature-owned table groups

| Group | Planned entities and scope |
| --- | --- |
| Tenancy | organisations; centers; operatories (center) |
| Access | people, memberships, role tags, permission cells (org); person-center grants (center); support grants (org, expiring) |
| Patients | patients, contacts, consent events, data requests (registration center); patient-center links only when cross-branch policy is implemented |
| Calendar | appointments, status history (center, patient, doctor, operatory) |
| Clinical | visits, clinical notes, chart findings, treatment plans/done, prescriptions and items, file metadata (center, patient) |
| Money | invoices/items, receipts, allocations, refunds, credit notes, expenses, journal entries/lines, voucher counters (center and financial year) |
| Masters | treatments, tax data, drugs, categories, templates (org; explicit center overrides where specified) |
| Operations | stock movements, lab orders, tasks, CRM, NABH records (center) |
| Integrations | outbox/messages, delivery events, credit ledger, AI proposals/actions, usage, connection metadata (org/center) |
| Governance | immutable audit events (org and nullable center), module entitlements, provisioning history |

Patient references never grant access by themselves. Until ACC-08 is confirmed,
registration-center access is required; other-center appointments and money stay
hidden. All reads, including search, counts, exports and realtime, share this rule.

## Clinical, money and concurrency invariants

Store UTC timestamps; evaluate dates in the center timezone (Asia/Kolkata default).
Store FDI tooth codes and convert at the boundary. Appointment status is one of
`scheduled`, `checked_in`, `engaged`, `checked_out`, `missed`, `cancelled`;
append transition timestamps in the same transaction as the change.

Money is Postgres bigint paise. Transfer it as decimal strings at JSON boundaries
and use bigint arithmetic server-side; never coerce unrestricted bigint to Number.
Treatment tax configuration is data, snapshotted on invoice lines for history.
A single `patient_balances` SQL view aggregates posted invoices, receipts,
allocations, refunds and credit notes without multiplying joins or counting an
advance twice. Its final sign and allocation rules must match BILL-03 tests.
Make the view security-invoker so underlying RLS applies.

Lock voucher counters per org + center + financial year + voucher type inside
the posting transaction; enforce a matching unique voucher constraint. Use
idempotency keys for retries and optimistic versions for stale form edits. Restore
soft-deleted records only after checking current permissions and unique keys;
never silently overwrite a newer record. Historical finance corrections use
reversal/credit workflows and retain the original audit trail.

## Storage and schema verification

Private buckets per organisation; metadata carries org, center, patient and opaque
object key. Permission-checked server code issues short-lived signed URLs. No
public patient objects or cached medical responses. File upload finalization and
cleanup need an auditable lifecycle because Storage and SQL cannot share one
transaction.

Every new table ships RLS, explicit grants, action access and local SQL isolation
tests together. Test anon denial, disabled membership, cross-org/cross-center
reads and writes, forged foreign keys, soft deletes, realtime visibility and
security-invoker views. Regenerate database types only after migrations succeed.
