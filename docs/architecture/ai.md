# AI adapters and proposals

P12 will implement this contract from AI-02/04/05/08/09/10. No AI connection or
patient-data transfer is enabled by this architecture work.

A server-only `AIProvider` offers `chat` with portable tool definitions and optional
`transcribe`. Anthropic, OpenAI and Google adapters translate the shared request,
stream/tool results and typed errors. Task routing selects configured provider and
model for chat/tool use, short drafts and transcription. Model names and secrets
come from environment/server configuration. Unsupported transcription fails
clearly or selects an explicitly configured capable provider.

Bounded timeouts and retries distinguish rate limits, outages and invalid output.
Fallback follows approved routing only, with the same consent, geography and cost
checks. If no eligible provider is configured, show “AI is not configured”. Keys,
raw prompts and medical content never enter browser logs or telemetry.

Read tools execute as the current staff user through RLS and field-level access.
Patient/portal text is untrusted data, never tool instructions. Each tool accepts
a narrow validated schema. Write tools return proposals only and receive no
privileged database client. Shared form schemas validate all proposed operations.
Ambiguous identity, year or tooth system requires staff clarification; never pick
a patient by guessing. Teeth are converted from the center's display system to FDI.

A proposal carries an opaque ID, org/center, actor, patient identity, expiry,
operation IDs/types, validated payloads and expected record versions. Persist it
server-side; never trust a client-modified approval token. Preview shows patient
identity and before/after values, blocked operations and reasons. Staff can edit
or deselect lines. All selected operations are revalidated and authorised on
confirmation in one normal action transaction. Medical, money and delete changes
always require preview and confirmation. Cancel makes no domain changes.

`ai_actions` records provider/model, instruction, proposal, selected lines, result
IDs and state under strict access and privacy controls. Confirmation consumes the
proposal once; retries return the existing outcome. Undo within seven days is a
new audited compensating transaction, permitted only when records still match the
saved versions and finance rules allow it. Never erase immutable audit events or
silently undo subsequent edits.

AI is off until the owner accepts a reviewed processing notice, the center has the
module and relevant patient consent exists. Minimise input, exclude Aadhaar/bank
numbers and unnecessary contacts. Audio retention defaults off. India's residency
rule applies to inference, telemetry and fallback too: keep clinical calls disabled
until provider processing location and terms meet the requirement (BLOCKERS 4).
Help-only responses may use public help articles without clinical context.

Meter requests/tokens/audio by org, enforce caps and alert at 80%. Provider/model
changes require the AI-12 proposal evaluation set, including ambiguity, permissions,
prompt injection, tooth systems and dates. Offline unit tests use fake providers;
live evaluations are opt-in and synthetic only.
