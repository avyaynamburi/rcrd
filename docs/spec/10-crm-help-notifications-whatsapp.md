# 10 · CRM, Help, Notifications and WhatsApp

Source: description Part 2 (icons 6–9), Part 10, Part 11 (every CRM page except Patient Tracker not shown).

## CRM (handshake icon)

### CRM-01 · CRM menu map
Second menu with three groups:
- Practice Growth: Patient Tracker
- CRM: Prospect, Enquiries, Campaign Widget, Opportunity
- Communications: Emails, SMS/WA Usage Detailed, WABA Usage Detailed, SMS/WA Usage Summary

### CRM-02 · Patient Tracker
- Title "Patient Tracker" with a Center dropdown beside it.
- Seven tabs across the top: Prospect (underlined by default), No Show, Cancelled, Consulted, Treatment Plans, In Progress, Recall.
- Under the tabs: the tab's name, View / Reset, and a gear on the far right (tab settings: look-back window in days, which statuses count).
- Each tab lists patients needing follow-up [DESIGN columns]: name, phone/WhatsApp icons, reason (e.g. missed on date; plan value pending; recall due date), last interaction (date, call status, by whom), next follow-up date, assigned tele-caller.
  - Prospect: prospects not yet converted (CRM-03).
  - No Show: missed appointments not yet rebooked.
  - Cancelled: cancelled appointments not yet rebooked.
  - Consulted: consultation done, no treatment started.
  - Treatment Plans: accepted/proposed plan items not yet done.
  - In Progress: treatment started, next sitting not booked.
  - Recall: recall due (SET-22).
- Row actions: log a call (call status chips from SET-27, notes, next follow-up date), book appointment, send message. Patients marked "Excluded" (PAT-11) never appear. Rows leave a tab automatically when the patient books.

### CRM-03 · Prospect [DESIGN]
Leads who are not patients yet: name, phone, email, source type/source, interest (treatment category), estimated value, status (New, Contacted, Interested, Not interested, Converted, Lost), assigned to, next follow-up, notes. "Convert to patient" opens the patient form prefilled.

### CRM-04 · Enquiries [DESIGN]
Inbound enquiries from calls, walk-ins, website form, Campaign Widget and online appointment requests: date, name, phone, channel, question, status (Open, Answered, Converted, Closed), owner. Convert to prospect or appointment.

### CRM-05 · Campaign Widget [DESIGN]
Create campaigns (name, source, offer text, start/end dates) and get an embeddable website snippet / shareable link with a small enquiry form. Submissions land in Enquiries tagged with the campaign; report shows enquiries → patients → revenue per campaign.

### CRM-06 · Opportunity [DESIGN]
Pipeline of treatment opportunities (mainly from treatment plans and prospects): patient/prospect, treatment, value, stage (Proposed, Discussed, Negotiating, Accepted, Lost), probability, expected date, owner. Board and list views; totals per stage.

### CRM-07 · Communications reports [DESIGN]
- Emails: log of emails sent (date, to, subject, template, status, opened if available).
- SMS/WA Usage Detailed: every SMS/WhatsApp (date, patient, channel, template, credits used, status: logged / sent / delivered / failed / read).
- WABA Usage Detailed: WhatsApp Business API conversations (category, conversation charges) when a provider is connected.
- SMS/WA Usage Summary: credits used per day/month per center and channel, remaining balance.

### CRM-08 · Bulk messaging [DESIGN]
"Send to many": filter patients (group, source, last visit range, birthday month, treatment category, recall due, tags, center), pick a template (festival greetings etc.), preview recipient count and credits needed, schedule or send now. Skips DND, excluded and inactive patients. (Help FAQ "How to send Bulk WA to patients" refers to this.)

## Help (light bulb)

### HELP-01 · Help page tabs
Two tabs top-left: HELP AND SUPPORT, SUPPORT TICKETS.

### HELP-02 · Help and Support
- Search box on the left, navy "Show All" button on the right.
- Full-width rows that expand when clicked (down arrow on the right), in groups:
  - Getting Started: Quick Patient Journey, New WhatsApp activation, Basic Setup (Settings), How to create Rcrd shortcut.
  - FAQs: WhatsApp messages are not going, How to send Bulk WA to patients, Unable to edit bill / unable to edit plan.
  - Clinic Setup Essentials: Clinic & Preference Setting, How to add Doctor/Staff, Add Payment Modes, SMS & Email Settings, and more.
- "Show All" lists one help row per feature: My Gallery, Doctor Remuneration, Appointment Series, Membership Plan, Rate Cards, Campaign & Channel, Clinical Notes, Templates, Inventory, Accounts, Patient Merge and every other feature.
- Articles are markdown files in `docs/help/` (one per screen help key). The same articles power "Need Help?" links (SHELL-10) and the AI assistant's how-to answers (AI-03). Writing them is part of each feature's definition of done.

### HELP-03 · Support Tickets
- Stack of cards, one per ticket the clinic raised: green date tag, status tag (Open, In progress, Answered, Closed), red ticket number, the question text, a link icon (copy link) and a down arrow (expand the reply thread).
- "+ New ticket" [DESIGN]: subject, description, screen/area, attachments (screenshot). Tickets go to the Rcrd platform console (PLAT-04); replies show here and trigger a notification.

## Notifications (bell)

### NOTIF-01 · Bell and Alert menu
Bell with a red badge showing the unread count. Opens a small second menu titled "Alert" with Application Update (accent when open) and Recent Features.
- Application Update: organisation name and "Rcrd — Click to get the latest version"; when a new deploy is live, clicking reloads the app to it (service-worker update).
- Recent Features: release notes written by Rcrd (PLAT-05).

### NOTIF-02 · In-app notifications [DESIGN]
Per-user notifications counted in the badge: online booking request received, support ticket reply, lab work overdue, low stock, message credits below alert level, plan/module expiring, AI change awaiting confirmation. Each links to the right screen; mark read / mark all read.

## WhatsApp

### WA-01 · WhatsApp module
- Tabs across the top: Read Me, Status, FAQs, About WABA, Submit WABA onboarding Request (WABA = WhatsApp Business API). Center dropdown top-right.
- Status tab, centred: green WhatsApp-style icon, "WhatsApp feature is on!", "Expiry on [date]", "Status: Connected" in green (or "Not connected" in red with what to do), navy "Refresh" button. Orange "Need help?" on the left.
- Read Me / FAQs / About WABA: our own help text (what WABA is, template approval, costs, message limits).
- Submit WABA onboarding Request [DESIGN]: business name, display name, WhatsApp number to use, Facebook Business Manager ID (if any), contact person; submits a request to Rcrd (PLAT-04), which connects the provider.
- Until a provider is connected, messages are logged but not sent (MSG-01), and Status says so clearly.
