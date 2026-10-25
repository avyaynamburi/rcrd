# Permissions

Design contract for ACC-01–ACC-16. ACC-01 implements tenancy reads; ACC-02/03 implements active-account checks and the narrow owner capability for account access. Detailed presets and domain/navigation permissions remain ACC-04/06/11; authenticated navigation defaults to no destinations until implemented.

Supabase Auth establishes identity. Active org membership and center grants come
from database records, never browser-provided org IDs or user-editable JWT
metadata. Fail closed for missing/disabled/deleted memberships. Scope each request
to one authorised organisation and center. Platform admins have no patient access;
owner-issued, time-limited support grants are explicit and audited.

## Presets and evaluation

| Base role | Default access |
| --- | --- |
| Owner / Owner and Doctor | All clinic areas, including access management and AI configuration |
| Doctor | Own/shared patients and clinical work; own appointments; bills for own treatments; no settings, accounting, inventory or financial reports |
| Staff | Booking, registration/contact, status changes, billing/collection and messaging; no clinical notes or prescribing |
| Accountant | Billing, receipts/refunds/credits, accounts, inventory, lab bills and finance reports; no clinical notes |

Tags such as Consultant or Tele-caller control lists and available presets; they
never bypass a deny. Store explicit per-area cells for entry, edit, delete and
view-report, plus read visibility, export control, ownership and appointment scope.
Presets initialize the grid; owners can edit it. Copying access requires access
management permission and copies values, not references to another person's grid.

`requirePermission(area, action, record)` checks membership, center, module,
area/cell, day restriction, ownership and record-specific rules. Same Day compares
the persisted record date with today in the center timezone; inserts check the
proposed date, updates check old and new dates to prevent date-changing bypasses.
When editing others is disabled, creator must equal the actor. A created-by value
from the client never counts. Own appointment scope filters calendar, search,
Today panel, counts and exports. Export disabled means server-side refusal for
Excel, PDF and print endpoints as well as hiding buttons.

## Database boundary

Implement `auth_org_id()`, `can_access_center(center_id)` and
`has_permission(area, action)` from trusted membership data. Helpers must avoid
recursive RLS; any security-definer helper uses a fixed search path, minimum
privilege and restricted execute grants. Every table enables RLS. Policies combine
org equality, center access and relevant area/read/ownership rules. Org-scoped
rows still require area permission. Read policies enforce clinical confidentiality
so staff cannot query notes through the API.

Application tables have no direct authenticated INSERT/UPDATE/DELETE grants.
Narrow transaction RPCs repeat actor, permission, date, ownership and tenancy
checks in SQL, then write audit atomically. Do not trust an RPC's caller-supplied
actor. Do not expose generic SQL or service-role write endpoints. Server actions
perform the same checks for useful errors; database enforcement prevents direct
API calls bypassing them.

Test every preset's allows and denies; expired support, forged identity/org,
revoked center, own/other creator, midnight IST, changed dates, direct RPC/table
writes, export endpoints and cross-tenant joins. UI hiding is never enforcement.
