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
