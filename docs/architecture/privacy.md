# Privacy and incident response

Engineering plan, not legal advice. Counsel must review the privacy notice,
consent language, retention schedule and processor terms before a paying clinic
uses the system. Open owner tasks are recorded in BLOCKERS 4.

## Collection, access and residency

Collect minimum required patient information. Record purpose-specific consent
events for messaging channels, AI and portal, including notice version, actor,
time, source and withdrawal. Withdrawal blocks future processing, including
queued messages; it does not fabricate consent for historical data. Do not include
real patient data in seeds, tests, screenshots, prompts or commits. `imports/` is
git-ignored and must not be read into coding-agent context.

Supabase is Mumbai (ap-south-1); Vercel functions use bom1. Before enabling any
processor, verify storage, processing, logs, backups and onward subprocessors
meet the India-only rule. No clinical AI/provider fallback before verification.
Keep application/infra logs free of medical content and secret values. Never put
patient responses in service-worker caches, analytics or third-party error traces.

Use RLS, explicit server permissions, least-privilege support grants and immutable
audit. Private Storage objects require short-lived, permission-checked URLs.
Aadhaar/ID and bank numbers need application-level authenticated encryption with
server-managed, rotatable keys; store key version and nonce, mask on screen and
avoid cleartext audit snapshots. Infrastructure disk encryption alone is insufficient.
Secrets live only in server environment/configuration; `.env.example` has no values.

## Patient requests and retention

Implement PROF-27/PORT-02 workflows for access, correction and erasure. Verify
identity and authority without disclosing records to the wrong requester. Record
request, scope, reviewer, decision and completion; permissions apply to exports
and signed downloads. Correction preserves necessary history. Soft delete alone
is not erasure: purge eligible active/storage copies and process backup expiry
under a reviewed retention policy. Clinical/accounting retention or legal holds
require a documented exception and patient response, determined with counsel.
Immutable audits retain only the minimum legally justified identity/history;
never promise unrestricted erasure of legally retained records.

Retention durations are not invented here. Owner/counsel must approve a category
schedule for clinical records, financial records, audit, messages, AI instructions,
audio, exports and backups. Audio retention defaults off. Test erasure with fake
data, including orphaned files, signed-link expiry and restoring backups without
reviving deleted records (reapply the deletion ledger).

## Breach response runbook

1. Alert the designated clinic owner and Rcrd incident lead privately. Record an
   incident ID, discovery time, affected systems and the minimum evidence needed.
   Do not paste patient data or secrets into tickets/chat.
2. Contain: revoke compromised sessions/keys/support grants, isolate the affected
   endpoint and pause relevant jobs. Preserve access/audit evidence with restricted
   access; do not delete logs or rewrite history. Production interventions remain
   owner-authorised operations.
3. Assess orgs, patients, data categories, time window, exposure and ongoing risk.
   Investigate authorization gaps, exports, object access and processor involvement.
4. Have owner/counsel determine required regulator/patient notifications and
   applicable deadlines under current law. Keep notice content and decisions in
   the incident record; no legal deadline is assumed by this codebase.
5. Fix and test isolation, rotate affected credentials, restore from verified
   backups if necessary and reconcile jobs/financial writes before resuming.
6. Document cause, containment, notifications, recovery and prevention work.
   Review access and retention controls and run a synthetic incident exercise.
