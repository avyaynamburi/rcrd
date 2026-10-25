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
