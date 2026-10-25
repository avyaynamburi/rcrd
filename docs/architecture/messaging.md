# Messaging adapters

P8 will implement MSG-01–MSG-07. The default is log only; no external account is
required to build the engine and no credentials are provisioned in this phase.

Use a server-only `MessageProvider` interface per channel (WhatsApp, SMS, email):
send a rendered request with an idempotency key and return a provider reference or
a typed failure. Adapters normalize delivery events and supported capabilities.
Select provider per org/center from platform-managed configuration; credentials
are encrypted server-side, never returned to the browser. Model delivery status
separately from retry attempts.

A log-only adapter persists “Not sent — no provider connected”, does not report
sent/delivered and never deducts credits. Real adapters require reviewed processing
locations consistent with the India residency requirement. Missing configuration
is visible; automatic fallback must not send through an unapproved provider.

## Scheduling, delivery and retries

Domain action transactions append outbox rows for relevant triggers. A five-minute
scheduler claims bounded due batches with row locks/leases, renders the versioned
template and checks current consent, DND flags, inactive/excluded status, center
access, entitlement, quiet hours, template approval and credits before dispatch.
Promotions require opt-in and wait outside 21:00–09:00 in the center timezone.
Transactional classification never bypasses channel consent rules.

Use a unique org + center + trigger + record + schedule-version key. Rescheduling
cancels pending old-version reminders and creates new ones atomically. Recheck
version before dispatch. A credit reservation and dispatch intent are transactional;
settlement uses a unique ledger key and releases failed reservations. Log-only
never reserves credits. Balance/top-up/transfer changes are audited money actions.

External delivery cannot be atomic with SQL. Reuse provider idempotency keys;
a timeout with an unknown outcome enters reconciliation, not blind resend. An
adapter without deduplication cannot promise exactly-once delivery; suppress
ambiguous retries pending status lookup/manual resolution. Retry known transient
failures with bounded backoff and show permanent failures for staff attention.

Queued → sent → delivered → read / failed events are scoped to the owning message.
Webhook handlers verify signature, timestamp/replay window and body size before
mapping a trusted provider reference to org/center. Deduplicate event IDs; late
or duplicate events cannot regress status or double-charge. Do not trust incoming
org IDs. Audit manual sends, configuration changes and operational retries.

## Templates and visibility

SMS adapters require configured DLT entity, header and template IDs. WhatsApp
business-initiated messages require approved templates; free-form messages respect
the service window. Promotional email requires unsubscribe plus configured domain
SPF/DKIM. Without these, fail clearly before sending.

Persist patient/channel/template/body/status/cost/times under org/center RLS;
message bodies inherit clinical access restrictions when they include medical
content. Share PDFs with expiring, permission-checked links. The manual composer
always previews recipients and content; log-only fallback may offer a staff-opened
`wa.me` link without claiming delivery. No WhatsApp brand icon is used.

Tests use fake providers and clock: duplicate triggers/webhooks, appointment edits,
consent revoked after queueing, quiet-hour edges, exhausted credits, log-only zero
cost, unknown send outcomes and cross-org provider-reference attacks.
