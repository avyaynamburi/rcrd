# Blockers — things only the owner can do

Codex adds an entry here whenever it needs something it can't do itself (an account, an API key, a payment, a clinic answer, a legal review). It keeps building with a safe stand-in and moves on. Work through this list when you have time, then tell Codex "BLOCKERS.md item N is done" or just update the entry.

Format:

```
## N. <short title>  (feature IDs)
Needed: what is missing
Owner steps: exact steps
Status: open | done
```

## 1. Supabase local resources and hosted Mumbai projects (P0-2)
Needed: enough free disk space and a healthy Docker Desktop; owner-created staging/production projects in Mumbai.
Owner steps: free at least 15 GB using your normal storage-management tools, restart Docker Desktop, then run `npm run db:start`, `npm run db:reset`, and `npm run db:types`. Commit the generated definitions. Follow `docs/architecture/supabase.md` to create and verify separate Mumbai projects and configure environment values without sharing keys in chat.
Status: open. CLI/config, migration directory and safe commands implemented. Docker launch and retry failed; eventual image pulls exhausted disk and Docker reported a read-only filesystem. No schema/type generation or remote provisioning is claimed complete.

## 2. Preview hosting credentials and hosted verification (P0-4)
Needed: owner Vercel project/account and GitHub preview environment secrets.
Owner steps: follow `docs/architecture/deployment.md`; configure the three Vercel secrets, manually run Preview deployment, verify Mumbai functions and install/update behavior on the HTTPS preview. Production deployment remains an owner task.
Status: open. PWA and preview pipeline are implemented; hosted deployment has not been run.

## 3. Verify and load the synthetic demo fixture (P0-5)
Needed: a working local Supabase after BLOCKERS 1; application tenancy, permission and audited transaction schema from P1 before persistent patient/team seed loading.
Owner steps: complete BLOCKERS 1's Docker/storage recovery and report that local Supabase starts. No patient data or new account is needed. Codex then implements the protected schema/seed action, wires local seed SQL, runs reset twice, regenerates types and verifies counts, audit and cross-org/cross-center denial. Owner must not run these fixtures against hosted projects.
Status: open. `npm run db:seed:preview` produces stable synthetic fixtures (two centers, five doctors, three staff, twelve patients), with logins disabled and no consent. Unit tests pass. On 2026-10-26, Docker launch and local start retry again failed with a read-only containerd metadata filesystem; the failing retry process was stopped. It is a preview, not a database loader; P0-5 remains blocked rather than claiming an unverified reset.

## 4. Privacy texts, retention and processor residency (P0-6; before live clinic use)
Needed: owner/counsel-reviewed notices, purpose/channel consent text, data-request and retention policy, incident contacts, and documented India-only processing for every clinical-data processor (including AI inference, fallback, messaging, telemetry and backups).
Owner steps: have counsel review `docs/architecture/privacy.md`; provide approved policy versions and retention categories through the normal project process, designate incident contacts, and obtain written processor region/subprocessor assurances. Configure only processors that satisfy the residency rule. Do not paste patient records or credentials into chat.
Status: open. Architecture keeps clinical AI calls and unverified providers disabled; log-only messaging is the safe default. This entry does not block architecture documentation or synthetic development.

## 5. Local browser test capacity (SHELL-02)
Needed: free disk space and Microsoft Edge for local browser verification.
Owner steps: free disk space with normal storage tools (only about 125 MiB was available), then install Microsoft Edge. Run `npm run test:e2e`. Windows Chrome/Edge verification is provided by the existing GitHub Actions matrix.
Status: open. SHELL-02 passes `npm run check` and all five targeted Chrome tests with one worker and tracing disabled. The initial parallel run exhausted disk while saving traces; Edge could not launch because it is not installed. No system files were removed and no browser was installed by this run.

## 6. Connect logout to clinic sessions (SHELL-03 / ACC-02)
Needed: authenticated session implementation in ACC-02 before real sign-out can run.
Owner steps: no action now; Codex must connect Yes to server-side sign-out when implementing ACC-02, disable repeat submits while pending, verify session revocation and handle failures without claiming success.
Status: done. ACC-02 connects Yes to global Supabase sign-out, prevents duplicate submits, and redirects only on success. Missing configuration and provider failures preserve the screen with a clear error. Synthetic live-session verification runs in CI.

## 7. Connect user menu to clinic identity (SHELL-04 / ACC-02 / ACC-08)
Needed: authenticated identity and server-authorized center access before real account controls can run.
Owner steps: no action now. Codex must populate initials/name/role/current center from the trusted session when building ACC-02, connect secure password changes, and list only permitted centers with server-side validation of any switch in ACC-08. Add allowed/denied and session failure tests then.
Status: open. The menu and help work in the data-free preview; identity is explicitly unassigned and password/center controls are disabled.

## 8. Connect top bar to trusted clinic context (SHELL-05 / ACC-02)
Needed: authenticated organisation context before displaying the actual clinic name.
Owner steps: no action now. Codex must pass the session-authorized organisation display name into AppTitle when implementing authenticated tenancy; forms/profiles must pass their explicit parent back destination, and calendar/status features must populate the controls slot.
Status: done for organisation identity. ACC-02 passes the RLS-authorized organisation name to AppTitle. Forms/profiles and calendar controls remain their respective later features. The data-free preview still displays “Clinic not configured”.

## 9. Connect live appointment counts (SHELL-06 / ACC-02 / P4)
Needed: authenticated center access, appointments schema with RLS, and a permission-checked read path before status totals or realtime subscriptions can run.
Owner steps: no action now. Codex must aggregate today's appointments across permitted centers using clinic-local day boundaries, subscribe only to authorized changes, refresh on day rollover/reconnection, and show loading/error/unavailable distinctly from zero. Connect the Calendar Today panel to these status filters in P4; test cross-org/cross-center denial and realtime updates then.
Status: open. Seven accessible preview circles and validated Calendar filter destinations exist; counts are unavailable. SHELL-06 remains blocked for live data rather than claiming completion.

## 11. Verify tenancy migration and generated types (ACC-01)
Needed: apply the tenancy migration, execute database isolation tests and generate actual schema types despite the local Docker failure.
Owner steps: none for ACC-01. BLOCKERS 1 still applies to local development; recover Docker/storage before running local database commands.
Status: done. GitHub Actions run 40180232194 applied the migration with `db:reset`, passed all 82 pgTAP assertions and generated types from that schema. The resulting artifact was retrieved and committed; lint/typecheck/unit and Ubuntu Chrome plus Windows Chrome/Edge jobs passed. No hosted database was touched. Local Docker remains unavailable; there is no application provisioning or mutation endpoint until audited actions exist.

## 12. Hosted individual accounts and recovery email (ACC-02/03)
Needed: owner-created Mumbai Supabase projects, environment configuration and approved recovery email delivery before clinic use. No live credentials are needed for synthetic CI verification.
Owner steps: follow `docs/architecture/authentication.md`; set the two public Supabase environment values and the fixed AUTH_SITE_URL; disable public signup, require 12-character passwords, configure the recovery token-hash email template and exact callback allowlist. Provision the first individual owner identity and membership through the trusted admin process (is_owner/login_enabled), enable hosted phone authentication, verify email/phone identifiers, and test delivery with your own non-patient account. Never paste passwords or tokens into chat. Review the login draft and recovery-link decision with the clinic.
Status: open for hosted onboarding. Synthetic accounts, account-access auditing and local Auth recovery are tested in CI. Full role/navigation configuration remains ACC-04/06; center preferences and switching remain ACC-08/SHELL-15.

## 13. Connect appointment visibility to live data (ACC-09 / P4)
Needed: appointment tables, assigned doctor identity mapping, Calendar/Today reads and count sources from P4.
Owner steps: none now. Codex must use `can_see_appointment(org_id, center_id, doctor_user_id)` in appointment SELECT RLS, keep aggregate and realtime reads under the same policy, and prove All/Own only filtering for calendar, Today and status counts including another doctor's, unassigned and revoked-center appointments. Do not expose live data before these checks pass.
Status: open. Owner-only audited All/Own only editor and SQL visibility predicate are implemented and tested independently; there is no appointment table or live appointment read to enforce yet. ACC-09 remains blocked for the full feature.
