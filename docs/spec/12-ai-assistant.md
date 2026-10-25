# 12 · AI assistant ("Rcrd Assistant")

Source: description Part 1 (Besto AI Bot floating button and speech bubble) plus the owner's requirements: answer how-to questions, look up clinic data, draft notes/messages, and fill in clinic records from typed or spoken instructions — always with a preview that staff confirm. Providers: Claude, OpenAI and Gemini, swappable.

Example the feature must handle end to end: "Henry Joe visited the clinic on May 25th, cavity on 36 and 46" → find the right Henry Joe → propose a visit dated 25 May, a clinical note (Dental Caries on 36, 46) and chart marks (caries on teeth 36 and 46) → staff check the preview → Confirm → saved and logged.

### AI-01 · Assistant button and panel
Floating button and speech bubble (SHELL-09). Clicking opens a side panel (about 420 px wide) over the right of the work area: message list, text box, microphone button, and suggestion chips relevant to the current screen (e.g. on a profile: "Summarise this patient", "Add today's findings"). The panel knows the current screen and patient as context.

### AI-02 · Provider layer (swappable)
- One server-side interface `AIProvider` with adapters for Anthropic (Claude), OpenAI and Google (Gemini): `chat` with tool calling and `transcribe` (speech-to-text) where the provider supports it.
- Routing config per task type (chat/tool use, transcription, short drafting) chooses provider + model; model names live in config/env, never hard-coded in features.
- Automatic fallback to the next provider on outage/timeouts.
- API keys only in server environment variables; never sent to the browser; never in git.
- Same tool definitions work for all three adapters (adapter translates the format).

### AI-03 · What it can do
1. How-to answers: retrieval over `docs/help/` articles (HELP-02), with links to the screen.
2. Data lookup: read-only tools (find patients, appointments today/for a doctor, a patient's dues, last visit, treatment plan, stock level, today's collections…), always within the asking user's permissions.
3. Drafting: clinical note wording from rough notes, WhatsApp/email messages, letters; drafts are inserted into the form for the user to edit and save — never auto-sent.
4. Data entry: change records via proposals (AI-04/AI-05).

### AI-04 · Proposals, not direct writes
- Write tools never touch the database. They return a Proposal: a list of operations (create visit, add clinical note, set chart conditions on teeth, book appointment, mark check-in, add treatment done, record payment…), each validated against the same schema as the normal forms.
- Ambiguity → the assistant asks instead of guessing (two patients named Henry Joe; "May 25th" with no year when both past and future are plausible; unclear tooth number).
- Tooth numbers are interpreted in the clinic's numbering system (SET-01) and stored as FDI.

### AI-05 · Preview and confirm
- Preview card shows: the patient's identity block (name, #number, age, branch, photo) so staff can catch wrong-patient mistakes; every change as a readable line (e.g. "Visit — 25 May 2026, Dr. Rao, RBI Layout"; "Chart — tooth 36: Caries (new)"; "Chart — tooth 46: Caries (new)"); for edits, old value → new value.
- Staff can untick lines or edit values inline before confirming.
- Confirm applies all ticked operations in one transaction through the normal server action layer (permission checks, validation, audit). Cancel discards.
- Medical, money and deletion operations can never skip the preview (no auto-apply setting exists).

### AI-06 · Supported data-entry actions (first set)
Create/update visit; clinical note fields (complaint, findings, investigation, diagnosis, notes, teeth, surface, POP, TOP, pulp, conclusion); charting conditions per tooth (PROF-25); treatment plan rows; treatment done rows; prescription rows (with allergy warnings shown in the preview); book/reschedule/cancel appointment; check-in/check-out; patient contact/medical updates; record a payment (preview shows amount and mode prominently); create task; log a CRM call. More actions are added by registering new tools against existing server actions.

### AI-07 · Voice dictation
- Microphone button records in the browser; audio goes to the server, is transcribed by a provider that supports audio (routing config), and the transcript appears in the text box for the user to correct before sending.
- Prompt the transcriber with dental vocabulary and the clinic's doctor/treatment names; handle Indian English.
- Audio is not stored after transcription unless the clinic turns on "keep recordings" [default off].

### AI-08 · AI audit trail and undo
Table `ai_actions`: user, time, center, provider and model, the instruction (text/transcript), the proposal, which lines were confirmed, resulting record IDs, status. Shown in Access Audit with a "via AI" marker. "Undo" on an applied proposal reverts it if those records haven't been changed since (within 7 days); otherwise explains what changed.

### AI-09 · Privacy and consent (DPDP)
- Per-clinic switch to enable the assistant (off until the owner turns it on and accepts the data-processing notice).
- Data minimisation: send only what the task needs; never send Aadhaar/ID numbers, bank/account numbers or full contact details unless the task requires them; prefer internal IDs.
- Use providers' business/API terms with no training on customer data; record which providers process data in the clinic's privacy notice.
- Patient-written text (portal, enquiries) is treated as data, never as instructions (prompt-injection safety).

### AI-10 · Permissions
The assistant acts strictly as the signed-in user: read tools respect RLS and ACC-06; a proposal containing an operation the user isn't allowed to do is shown with that line blocked and the reason.

### AI-11 · Cost control and licensing
AI is a licensed module per center (PLAT-03). Metering per org: requests, tokens, audio minutes, estimated cost; monthly cap set by Rcrd/owner with a warning at 80%. Use cheaper/faster models for simple lookups and transcription, stronger ones for multi-step data entry.

### AI-12 · Quality checks
A test set of example instructions (English and Indian-English phrasing, ambiguous names, tooth-number variants, dates like "last Tuesday") with the expected proposals; run against each provider in CI on demand. A provider/model change ships only if it passes.
