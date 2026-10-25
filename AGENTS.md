# AGENTS.md — Rcrd

You are Codex, the only coding agent on this project. You plan, build, test and review the work yourself. Read this file at the start of every session; read other files only when the task needs them.

Rcrd is dental practice management software for Indian clinics: appointments, patients, clinical records, GST billing, WhatsApp/SMS reminders, accounting, inventory, labs, CRM, NABH records, a patient portal and an AI assistant. It is modelled on BestoSys (the clinic's current software) so staff feel at home, with a simpler look. First customer: **DENTALPROFILES** (branches **RBI Layout** and **Bellandur**, Bengaluru). After that it is sold to other clinics, so it is multi-clinic, multi-branch SaaS from day one.

Every feature from the clinic's BestoSys walkthrough is specified in `docs/spec/`, plus the features we added. The original walkthrough is `docs/source/DentalSoftwareDescription.txt` (reference only — the spec files are the authority).

---

## 1. Where things are

| Need | Look in |
|---|---|
| Things only the owner can do | `docs/BLOCKERS.md` |
| What to build next, and every feature ID | `docs/PROGRESS.md` (phased checklist; find the first `- [ ]`) |
| Exact behaviour of a feature | `docs/spec/NN-*.md` → the `### ID · Title` section only |
| Architecture decisions | `docs/architecture/` (you write these in P0-6 and keep them current) |
| Help articles (also feed the in-app AI) | `docs/help/<help-key>.md` |

Spec markers: `*` / **[DESIGN]** = not shown in the recordings, we design it — flag it for the clinic. `?` / **[CONFIRM]** = shown but unclear — build the best guess, flag it.

---

## 2. Non-negotiables

1. **Patient data is medical data.** Every table is isolated by `org_id` with Postgres row-level security; every write goes through the action layer with a permission check and an audit entry (spec 02, ACC-11). The UI hiding a button is never the security.
2. **Never use real patient data** in development, tests, seeds, prompts, screenshots or commits. Seeds use fake people. Import files live in `imports/` (git-ignored); never open or paste their contents into a chat.
3. **Data stays in India.** Supabase projects in the Mumbai region (ap-south-1); Vercel functions pinned to `bom1` (Mumbai).
4. **India's DPDP Act 2023**: collect only what's needed, record consent (messaging, AI, portal), support patient access/correction/erasure requests (PROF-27, PORT-02), encrypt Aadhaar/ID and bank numbers at rest and mask them on screen, keep the audit log, have a breach-response note in `docs/architecture/privacy.md`. The privacy policy and consent texts need a lawyer's review before the first paying clinic — never present code comments as legal advice.
5. **Money** is integer paise, never floats; GST rates come from data (Treatment master), never hard-coded; tax decisions are the clinic's CA's, not ours (BILL-02).
6. **No BestoSys branding.** Never use their name, logo, wording, help text, or the WhatsApp logo. Same layout and workflow, our own words and icons (lucide-react).
7. **Never lose a booking or a bill.** Transactions for multi-row saves, disabled double-submit, offline banner instead of silent failure (SHELL-14), soft delete with restore (UI-09).
8. **The in-app AI never writes directly.** It proposes; staff confirm (spec 12, AI-04/AI-05). Medical, money and delete operations always need confirmation.
9. Secrets only in environment variables (`.env.local`, Vercel, Supabase). Never in git, never sent to the browser. `.env.example` lists them with no values.

---

## 3. Tech stack and commands

- **Next.js** (latest stable, App Router, React Server Components, Server Actions) + **TypeScript** (strict).
- **Supabase**: Postgres (+ RLS), Auth, Storage (private buckets, signed URLs), Realtime (calendar/status live updates), scheduled jobs (pg_cron or a cron route) for messages/recalls.
- **UI**: Tailwind CSS + shadcn/ui primitives, lucide-react icons. No heavy UI kits.
- **Calendar**: our own grid components (no paid calendar library — resource/doctor views are paid in most libraries).
- **Forms/validation**: react-hook-form + zod; the same zod schemas validate on the server and in AI proposals.
- **Data access**: supabase-js with generated types (`npm run db:types`); SQL migrations in `supabase/migrations/`.
- **PDF**: server-side PDF rendering (@react-pdf/renderer) using Printing Setup (spec 13 PRINT-01). **Excel**: exceljs.
- **In-app AI**: provider adapters for Anthropic (Claude), OpenAI and Google (Gemini) behind one interface (spec 12, AI-02). Model names in config/env. (This is a product feature for clinics, separate from you building the app.)
- **Messaging**: provider adapters, default "log only" (spec 13, MSG-01).
- **Testing**: Vitest (unit, incl. permission and money maths), Playwright (end-to-end, Chrome + Edge), Supabase local for RLS tests.
- **Hosting**: Vercel (region bom1) + Supabase (Mumbai). Installable PWA; no native desktop build.

Commands (create these in P0 and keep them working):

```
npm run dev          # app on http://localhost:3000 (needs `npx supabase start` and Docker running)
npm run check        # lint + typecheck + unit tests — must pass before every commit
npm run test:e2e     # Playwright
npm run db:reset     # reset local DB, run migrations + fake seed
npm run db:types     # regenerate Supabase types after a migration
```

---

## 4. Repo layout

```
app/(auth)/            login, forgot password
app/(app)/             signed-in app: layout = icon rail + top bar (spec 01)
  calendar/ dashboard/ patients/ patients/[id]/ reports/ admin/ crm/ help/ settings/ whatsapp/ notifications/
app/(public)/          online booking, request, portal, feedback (spec 14)
app/platform/          Rcrd company console (spec 16)
app/api/               webhooks (messaging, payments), cron, AI endpoints
components/shell/      rail, top bar, second menu, status circles, AI button
components/ui/         shadcn primitives
components/blocks/     ListPage, FormPage, Popup, WarningBox, TeethPicker, DateBox, Exports… (spec 07)
lib/actions/           ALL mutations: validate → requirePermission → write → audit (one file per area)
lib/permissions/       roles, presets, grid evaluation (Same Day / Any Day / own-records)
lib/billing/           invoice maths, GST, numbering, balances
lib/messaging/         engine, templates, triggers, providers/
lib/ai/                providers/, tools/, proposals/, routing config
lib/pdf/               letterhead + document templates
lib/teeth/             FDI ⇄ Universal ⇄ Palmer conversion
supabase/migrations/   schema + RLS policies + SQL functions/views
supabase/seed/         fake demo clinic + default masters (from the spec seed lists)
docs/ …                spec, progress, architecture, help, source
tests/unit  tests/e2e  tests/rls
```

---

## 5. How to work — autonomous mode

The owner wants the whole build done without being asked anything. Usually you are run by `scripts/autopilot.sh`, one feature per run, with nobody watching. **Never stop to ask a question and never wait for approval.** Make the most reasonable decision, write it down, and keep going.

**Each run**
1. Take the first unchecked item (`- [ ]`) in `docs/PROGRESS.md`, plus any closely related items in the same phase that are naturally built together (keep it to a size you can finish and test in one run).
2. Read only those features' sections of their spec files (search for `### CAL-25`, read that section). Don't read whole spec files or the source description unless you need to.
3. Implement, add tests, run `npm run check` (and the relevant `npm run test:e2e -- <file>`). Fix failures until green.
4. Self-review the diff against the spec sections and section 2 of this file. Fix what you find.
5. Tick the IDs in `docs/PROGRESS.md`, commit with the feature ID first (`CAL-25: new appointment form`) and `git push`.
6. End with two or three lines: what's done, what was decided or flagged.

**When something needs the owner** (an account, an API key, a payment, a clinic answer, a legal text): don't stop. Build it with a safe stand-in (log-only adapter, fake/seed data, env var left empty with a clear "not configured" message in the UI), add an entry to `docs/BLOCKERS.md` (ID, what's needed, exact steps for the owner), and continue. If an item truly can't be built at all without the owner, mark it `- [~]` in PROGRESS.md (blocked), log it in BLOCKERS.md, and move to the next item.

**Never do without the owner**, even in autonomous mode: delete or rewrite git history, force-push, touch anything outside this repo folder, create paid accounts or spend money, use real patient data, deploy to production, or turn off a non-negotiable from section 2. Log these in BLOCKERS.md instead.

**Careful areas** (patient data or money): after you commit, the autopilot script runs a separate read-only Codex review of the change and then a fix run for anything it finds. In those runs, take the review seriously and fix real problems; if a finding is wrong, note why in the commit message.
- `supabase/migrations/` that create tables or change RLS policies
- `lib/permissions/`, `lib/actions/` core, auth and sessions
- `lib/billing/` (GST, discounts, balances, voucher numbering)
- `lib/ai/` proposals and tools, and any AI write path
- file storage access and signed URLs, `app/api/` webhooks

**Keep runs small (saves usage)**
- One feature (or a small related group) per run; the script starts a fresh run each time.
- Don't read `node_modules`, lockfiles, generated types, `.next`, or full logs; use `tail`/`head` on long command output.
- Use the shared blocks in `components/blocks/` instead of rebuilding layouts.

**Decisions**: decide [DESIGN]/[CONFIRM] questions yourself, add a dated line to `docs/architecture/decisions.md`, and keep section 11 current so the owner can check them with the clinic later.

**If Docker isn't running** (local Supabase fails to start): run `open -a Docker`, wait up to 2 minutes, retry once; if it still fails, log it in BLOCKERS.md and work on items that don't need the database.

---

## 6. Build phases (detail and checkboxes in `docs/PROGRESS.md`)

P0 Setup → P1 Foundation (shell, logins, permissions, audit, shared UI) → P2 Core settings → P3 Patients → P4 Calendar → P5 Profile, visits, EMR, charting → P6 Billing, GST, printing → P7 Dashboard + BestoSys import → **PILOT at DENTALPROFILES** → P8 Messaging → P9 Accounting, inventory, lab → P10 CRM and growth → P11 Reports → P12 AI assistant → P13 Portal and online booking → P14 NABH → P15 Platform console, help, notifications, integrations.

Reorder only with the owner's OK. Before the clinic fully switches off BestoSys, P8 must be done and a real WhatsApp/SMS provider connected.

---

## 7. Architecture rules

- **Tenancy**: Platform → Organisation → Center → Operatory. Every row has `org_id`; branch data has `center_id`. RLS helper functions (`auth_org_id()`, `can_access_center(center_id)`, `has_permission(area, action)`) are used by every policy. RLS tests in `tests/rls/` prove cross-org and cross-center isolation.
- **Action layer**: every mutation = `lib/actions/<area>.ts` → zod validate → `requirePermission(area, action, record)` (handles Any Day / Same Day / own-records) → DB write in a transaction → `audit()` → return typed result. Pages, the AI and imports all call these; nothing writes to tables directly.
- **Audit**: who, when, center, area, action, record id, before/after JSON, source (`ui` / `ai` / `import` / `system` / `support`). Immutable.
- **Common columns**: `id uuid`, `org_id`, `center_id` (where relevant), `created_by/at`, `updated_by/at`, `deleted_at` (soft delete), `external_source/id` (imports).
- **Money**: `bigint` paise; one SQL view for patient balance used everywhere (BILL-03). Voucher numbering via a locked counter per center + FY + type.
- **Time**: store UTC (`timestamptz`); display in the center's timezone (default Asia/Kolkata); "Same Day" and "today" use the center's timezone.
- **Teeth**: store FDI codes; convert for display with `lib/teeth`.
- **Statuses**: appointment `scheduled | checked_in | engaged | checked_out | missed | cancelled` with timestamps per change.
- **Files**: private Storage buckets per org; access via short-lived signed URLs after a permission check; never public links to patient files.
- **Realtime**: calendar, Today panel and status circles subscribe to appointment changes for the current center.
- **Licensing**: module checks (`hasModule(center, 'nabh')`) in one place; expired → the standard warning box (ADM-04).
- **i18n-ready**: UI strings in English now but kept in one dictionary so Hindi/Kannada can be added; patient-facing message/prescription language follows the patient's Language field.
- **Seeds**: default masters from the spec seed lists live in `supabase/seed/defaults/` and are applied to every new organisation (PLAT-06).
- **Dependencies**: prefer what's installed; add a new package only when it clearly saves work, and say why in the commit.

---

## 8. Design — usable first, simple colours

Copy BestoSys's **layout** (icon rail, top bar, second menu, calendar with Today panel, profile with left cards) at the sizes in spec 01/03/06. Use a **plain, calm palette**: white surfaces, one navy, one accent, status colours only where they carry meaning. No gradients, no decorative shadows, no animations beyond quick transitions.

```
--navy:      #1E2A4A   rail, headings, primary buttons, selected tab underline
--accent:    #E07B39   active rail icon / menu item, "Need Help?"
--bg:        #FFFFFF   work area      --surface: #F6F7F9   cards, table headers
--border:    #E2E5EA   --text: #1F2430   --muted: #6B7280
--success:   #2E9E5B   Yes, Out, Connected, Treatment Done rows (tint #EAF6EF)
--danger:    #D64545   No, In, money owed, required *, close x
--warning:   #F2C94C   "patients haven't checked in" strip (tint #FFF7DB)
--today:     #FFF1E6   today's calendar column
status:      scheduled #8A94A6 · in #D64545 · engaged #E07B39 · out #2E9E5B · missed #4B5563 · cancelled #C7CCD4
appointment default card colour #C2417A (doctor/category colours from a 10-colour palette, all readable with white text)
```

- Font: Inter (or system UI), base 14 px, nothing under 12 px; numbers tabular.
- Sizes: rail 70 px, top bar 60 px, second menu 290 px, Today panel 345 px, appointment pop-over 290 × 450, appointment form 1000 × 650, profile left column 300 px, list rows 32 px, patient rows 50 px.
- Must work at 1920×1080 and 1366×768; phone layout per SHELL-13.
- Accessibility: visible focus, keyboard use (UI-11), colour never the only signal (status words/icons too), WCAG AA contrast.
- UI text in plain English, from the strings dictionary.

---

## 9. Testing, Windows and Mac

- Development and daily testing on the Mac (`npm run dev`, Chrome/Edge).
- CI (GitHub Actions) runs `npm run check` on Ubuntu and Playwright on **windows-latest with Edge and Chrome** plus Ubuntu Chrome — the clinic uses Windows PCs.
- Before each phase demo: manual pass on Windows 11 (Parallels on the Mac) — install the PWA, print an invoice and a prescription, check fonts and scaling at 1366×768.
- Every permission preset gets tests for allowed and denied actions; RLS tests for cross-org/cross-center access; unit tests for GST/discount/balance maths and tooth-number conversion.

---

## 10. Definition of Done (per feature ID)

1. Behaviour matches its spec section (or the deviation is written in `docs/architecture/decisions.md`).
2. Permission checks + audit in place; RLS covers any new table.
3. Unit tests for logic; Playwright test for the main happy path of each screen.
4. Works at 1366×768 and in Edge on Windows (CI green).
5. Empty, loading and error states done (UI-02, UI-14).
6. Help article in `docs/help/` for any new screen, linked from its "Need Help?".
7. `npm run check` passes; committed with the feature ID in the message; ticked in `docs/PROGRESS.md`.
8. Careful-area changes went through the autopilot review and fix runs (section 5).
9. [DESIGN]/[CONFIRM] items added to section 11 if still open.

---

## 11. Ask the clinic (open questions — keep this list current)

- CAL-02 group-of-people icon on the calendar top bar: what does it open?
- SHELL-06 dark-grey status circle: which status?
- CAL-33 "Auto Billing" tick box: exact behaviour?
- ACC-16 "Advanced Security": what does it do in BestoSys?
- ACC-08 can a patient registered at one branch be treated at the other without re-registering?
- PROF-03 the ten profile icons: confirm each one's action.
- PROF-16 option lists for Surface, Pain On Palpation, TOP, Pulp Sensitivity, Conclusion.
- PROF-20 the small person icon on each prescription row.
- SET-13 "Project" and SET-26 "PROWA": what are they used for?
- SET-39/SET-40 the exact 12 orthodontic goals and 8 limitations (or take them from the export).
- All [DESIGN] screens (Reports, Month & Doctor/Operatory views, Docs & Images, Membership, Charting, Treatment Plan/Done, Package, Task, Series, Group, CRM pages): show drafts before polishing.
- Which BestoSys exports are available (patients, appointments, visits, invoices, files)?
