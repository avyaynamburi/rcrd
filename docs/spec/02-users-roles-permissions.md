# 02 · Logins, roles and permissions

Source: description Part 2 (avatar "FD" front desk vs "RT" owner logins), Part 8.1 Owner & Doctor → ACCESS tab, Staff, Centers, Clinic → Advanced Security, Part 9 Team → Access Audit, Part 7.1 created/updated notes. The recordings came from at least two different logins, so different users see different things; that is a first-class feature here.

### ACC-01 · Tenancy model
- Platform (Rcrd, the company) → Organisation (one clinic business, e.g. DENTALPROFILES) → Centers (branches, e.g. RBI Layout, Bellandur) → Operatories (chairs/rooms).
- Every table carries `org_id`; branch-level data also carries `center_id`.
- One organisation can never read or write another organisation's data, enforced in the database (ACC-11).

### ACC-02 · Individual logins
- Every owner, doctor and staff member has their own account. No shared logins, ever.
- Login with email or mobile number + password. Forgot-password flow by email link. Users change their own password.
- Per person, the owner controls: "Enable Login" switch (off = person exists in lists, e.g. a visiting doctor, but cannot sign in), "Set New Password" button.
- Login screen [DESIGN]: Rcrd logo, email/mobile, password, "Forgot password?", clear error messages. After login the user lands on the Calendar, or on their first allowed screen if they can't see appointments.

### ACC-03 · Mobile access
"Enable Mobile Access" switch per person. When off, sign-in from phones/tablets is refused (best effort by device detection; document the limitation).

### ACC-04 · Roles and role tags
- Base roles: Platform Admin (Rcrd staff only), Owner, Owner and Doctor (owner who also treats patients), Doctor, Staff (front desk), Accountant.
- Extra role tags (tick boxes on the person's form): Consultant, Orthodontist, Tele-caller, Marketing, Accountant. Tags control which lists the person appears in (e.g. tele-callers in CRM call assignment, consultants in referral lists) and can unlock matching permission presets.

### ACC-05 · Default permission presets
Applied when a user is created; the owner can change anything afterwards (ACC-06).
- Owner / Owner and Doctor: everything, including settings, money, reports, staff, access audit, AI settings.
- Doctor: their own and shared patients, appointments, clinical notes, treatment plans, treatment done, prescriptions, files, charting. Can create bills for their treatments. No settings, accounts, inventory, reports with money, or other people's permissions. Appointment visibility = Own (owner can set All).
- Staff (front desk): appointments, patient registration and contact details, check-in/out, Bill & Collect, receive payments, messages. No clinical notes or prescriptions (view only the appointment purpose), no reports, no settings.
- Accountant: billing, receipts, refunds, credit notes, accounting, inventory, lab bills, financial reports. No clinical notes.

### ACC-06 · Detailed access grid
On the person's ACCESS tab:
- Rows (areas): Patient, Appointment, Treatment & Package (Settings), Clinical Notes, Treatment Plan, Treatment Done, Prescription, Docs & Images, Charting, Billing / Invoices, Receipts & Refunds, Credit Notes, Payment Made / Expenses, Accounting (Cash/Bank, Journal, Opening Balances, Settlements), Inventory, Lab, Tasks, CRM, Messaging (WA/SMS/Email), Reports, Settings, NABH, Membership & Packages, AI Assistant. (BestoSys showed "Patient, Appointment, Treatment & Package (Settings), Clinical Notes and more"; the rest are ours.)
- Columns: Allow Entry, Allow Edit, Allow Delete, View Report.
- Each cell is a dropdown: Any Day / Same Day / No Access.
  - Same Day = the user may only add/edit/delete records whose record date is today (clinic timezone). Lets owners stop staff changing yesterday's bills.
- Some cells have an "Edit Data Entered by others" tick box under them; when unticked the user can only edit/delete records they created.

### ACC-07 · Copy access
"Select Copy Access from" dropdown on the right of the grid copies another person's full grid into this one (then editable).

### ACC-08 · Center access
"Centers" box: which branches the person can work in. Data from other branches is invisible to them (patients registered at another branch can still be found by search if the org allows cross-branch patients [CONFIRM]; their appointments/bills at other branches stay hidden).

### ACC-09 · Appointment visibility
"Allowed to see appointments" dropdown: All / Own only. Own only = calendar, Today panel and status counts show only this doctor's appointments.

### ACC-10 · Export control
"Disable Export to Excel/PDF in Reports" switch: hides Excel/PDF/print buttons on reports and lists and blocks the export endpoints server-side.

### ACC-11 · Enforcement (security-critical — careful area, AGENTS.md §5)
- Reads: Postgres row-level security on every table (org isolation + center access + appointment visibility).
- Writes: every mutation goes through one server-side action layer that calls `requirePermission(area, action, record)` before touching data, then writes the audit log.
- The UI hides things the user can't do, but the UI is never the security.
- Automated tests per role prove each preset can and can't do what this file says.

### ACC-12 · Access Audit (Admin → Team → Access Audit) [DESIGN]
- Logs: sign-ins, sign-outs, failed sign-ins, opening a patient's profile or files, creating/editing/deleting any record (with before/after values), exports and prints, permission changes, AI-assisted changes (with "via AI" marker), support access by Rcrd staff.
- Page: standard list with filters (from/to date, user, center, area, action), Excel/PDF export (owner only). Audit rows can't be edited or deleted by anyone.

### ACC-13 · Created/updated stamps
Every record stores created_by, created_at, updated_by, updated_at; shown in the yellow note in each row's three-dot menu: "Created: [user] on [date]", "Updated: [user] on [date]".

### ACC-14 · Owner-only by default
Settings, accounting, money reports, Access Audit, user and permission management, plan/module purchases, AI settings, data import, patient merge.

### ACC-15 · Platform admin (Rcrd company) — see spec 16
Rcrd staff manage organisations, plans and support but cannot read patient data by default. Support access ("break-glass") must be granted by the clinic owner for a limited time and is logged in the clinic's Access Audit.

### ACC-16 · Advanced Security switch
Clinic Setting → General Details → "Advanced Security" (with an (i) explainer). [CONFIRM what BestoSys does.] Ours: when on, all users must use two-step verification (email/SMS one-time code), sessions time out sooner, and only one active session per user.
- Always on regardless: auto sign-out after inactivity (owner sets minutes, default 30), passwords hashed by Supabase Auth, rate-limited sign-in.

### ACC-17 · Appointment summary notification
"Send Appointment Summary" tick box per doctor: daily message/email listing that doctor's appointments (see MSG-02 doctor notifications).

### ACC-18 · Deleted people
Deleting a doctor/owner or staff member is a soft delete: they move to "Deleted Owner & Doctor List" / "Deleted Staff List" under the main table, can't sign in, keep their name on historical records, and can be restored.
