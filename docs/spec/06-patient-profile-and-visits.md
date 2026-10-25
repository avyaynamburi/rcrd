# 06 · Patient profile, visits and clinical records

Source: description Part 6, Part 11 (Docs & Images, Membership, Charting tabs and the Treatment Plan / Treatment Done / Package sections were not shown).

Teeth are always stored as FDI numbers (11–48 adult, 51–85 baby). The screen shows them in the clinic's chosen system (FDI, Universal or Palmer — SET-01).

### PROF-01 · Profile layout
Narrow left column (about 300 px) of small cards, wide right area. Rail on the far left; top bar shows a back arrow, the organisation name and the status circles.

### PROF-02 · Identity card
Round circle with the patient's two initials (or photo), name in bold, "Gender, age (date of birth)", patient number with branch in brackets (e.g. "#1234 [RBI Layout]"), a phone line and an email line each with a small icon, then a translate icon and the patient's language (e.g. "English").

### PROF-03 · Quick-action icon row [CONFIRM functions]
About ten small grey icons with tooltips. Our mapping: calendar (book appointment), kit (treatment plans), headset (log a call / CRM interaction, CRM-02), documents (Docs & Images tab), clipboard (consent forms / letters), expand (full-screen case view), printer 1 (print patient profile), printer 2 (print full case sheet), link (send patient-portal link, PORT-02), pencil (edit patient, PAT-15).

### PROF-04 · Message buttons
Three buttons in a row: "SMS/WA" with a + (compose WhatsApp/SMS from templates or free text, MSG-06), "Email", "Letter" with a + (pick a Letter template, fill tokens, then print / PDF / email / WhatsApp; signed consent copies are saved to Docs & Images).

### PROF-05 · Relationship card
"Relationship", the date they became a patient, and a small (i) icon (tooltip: source type, source/referrer, who registered them). Two columns: Group / Ratecard (e.g. None / Standard) and Membership / Family (active membership name; family members as links). Then "Reviews" with a Google "G" icon (send this branch's Google review link, SET-21) and an Instagram icon (send the clinic's Instagram link).

### PROF-06 · Social Notes card
Title, navy + and collapse arrow on the right, a small illustration of two people at a table, caption "Know your patient better. Nurture a bond." Notes list with date and author (personal details like hobbies, family events).

### PROF-07 · Internal Notes card
Same look; caption "Know your patient's preferences. Serve them better." (e.g. "prefers evening slots", "anxious about needles").

### PROF-08 · Address row
"Address" row with a down arrow; expands to show the address and a map link.

### PROF-09 · Active status
Green word "Active" (or grey "Inactive") with a blue "Change" link (PAT-16).

### PROF-10 · Top strip of the right area
- Left: "Medical Information [last updated date]" with a pencil (opens the Medical tab editor); four small rows: History (medical conditions + current medications), Dental (dental conditions), Allergies (shown in red when present — safety), Habits.
- Middle: "Blood Group"; "Contact" with a pencil showing Gen. Practitioner and Emergency contact.
- Far right box: "Payment Due", the INR amount, and links Receive (ADM-13), Refund (BILL-03), Send Payment Link (BILL-06).

### PROF-11 · Tabs
Four tabs spread evenly: VISITS (navy underline when active), DOCS & IMAGES, MEMBERSHIP, CHARTING.

### PROF-12 · Visit history (VISITS tab)
Each visit is a block starting with an orange date tag and a small print icon (prints that visit's case sheet). Under it, sections each starting with a small coloured dot:
- CLINICAL NOTE: table header #, Surface, Pop, TOP, Pulp Sensibility, Conclusion, Files; then "Chief Complaint" and "Findings" (and Investigation, Diagnosis, Notes when filled) as labelled lines. Teeth shown in the clinic's numbering system.
- TREATMENT PLAN (when present): plan rows with status.
- TREATMENT DONE: rows with a light green background; columns Treatment (with tooth number), Charges, Gross Amt, Disc, Net Amt, GST, Total, Bill (bill number as a link to the invoice), Files; a Total row and a print icon on the right.
- PRESCRIPTION: columns Drug, Dosage (Morning, Noon, Night), Duration, Total Qty, Instruction; WhatsApp-share icon and print icon on the right.
- INSTRUCTIONS (when present).
- RECEIPTS, REFUNDS, CREDIT NOTES: columns Voucher #, Mode, Doctor (voucher number links to the voucher).
Each section has edit/delete per permissions (ACC-06, Same Day rules).

### PROF-13 · Visit history window
- Default shows the last six months; "Expand latest visit only" toggle collapses older visits; "Get Lifetime Data" button loads everything.
- No recent visits: "No data in last six months. Please click on Get lifetime data to see the past data" with buttons "Get Lifetime Data" and "Add first Visit".

### PROF-14 · Add-visit button
Round navy + button floating bottom-right (next to the AI button) opens the New Visit form.

### PROF-15 · New visit form
Appears at the top of the VISITS tab.
- Row 1: Center dropdown, Visit Date (red x to clear; default today), Doctor dropdown, Appointment dropdown (links the visit to one of today's appointments for this patient), "Check-In" button on the far right (checks the linked appointment in).
- Row 2: blue link "Update Medical History, Habits, Allergies" (opens the Medical editor inline) on the left; navy "Change Doctor" button on the right (changes the doctor for all sections).
- Six grey bars, each with a + on the far right; clicking opens that section (each can be added more than once): Clinical Note, Treatment Plan, Treatment Done, Package, Prescriptions, Instructions.
- Bottom: "Need Help?" left; CANCEL and SAVE right.

### PROF-16 · Clinical Note section
Bordered box with a small red bin top-right (removes the section).
- Doctor dropdown across the full width.
- Two-column grid: Teeth | Surface (dropdown); Pain On Palpation (dropdown) | TOP — tenderness on percussion (dropdown); Pulp Sensitivity (dropdown) | Conclusion (dropdown).
  Dropdown values [CONFIRM with the clinic]: Surface — Mesial, Distal, Occlusal, Buccal/Facial, Lingual/Palatal, Incisal and combinations (MO, DO, MOD…); Pain On Palpation — Present / Absent; TOP — Positive / Negative; Pulp Sensitivity — Normal, Hypersensitive, Delayed, No response; Conclusion — Diagnoses from the Clinical Notes master (SET-29).
- TOOTH PICKER (opens when clicking Teeth): small numbered squares laid out like a mouth; corner labels UR top-left, UL top-right, LR bottom-left, LL bottom-right; rows:
  - baby upper: 55 54 53 52 51 | 61 62 63 64 65
  - adult upper: 18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28
  - adult lower: 48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38
  - baby lower: 85 84 83 82 81 | 71 72 73 74 75
  - "Full Mouth" button under the chart. Multi-select; labels follow the numbering setting.
- "Vitals" row with a down arrow [DESIGN fields]: blood pressure, pulse, temperature, SpO₂, respiratory rate, blood sugar, weight, height.
- Chief Complaint box with a blue "Pain Scale" link at its right end (0–10 picker with faces; inserts "Pain scale: 7/10").
- Findings, Investigation, Diagnosis and Notes boxes, one under another.
- Helper column on the right (x ≈ 1525–1885): "Options" dropdown (Complaints, Findings, Investigations, Diagnoses, Notes — defaults to the box being typed in), Search box, and a list of ready-made phrases from the Clinical Notes master (e.g. Complaints: Pain, Swelling, Bleeding Gums, Sensitivity, Discolouration, Ulcer). Clicking a phrase inserts it into the box with the cursor.

### PROF-17 · Treatment Plan section [DESIGN]
- Rows: treatment (searchable, Treatment master), teeth (tooth picker), quantity, charges (from the patient's ratecard), discount (% or amount), GST, total, phase/sitting number, notes.
- Each row has a status: Proposed, Accepted, Declined, Done. Plan total and accepted total shown.
- Print/PDF/WhatsApp the plan on the Treatment Plan letterhead size (SET-03).
- Accepted-but-not-done rows feed CRM → Patient Tracker → Treatment Plans and Opportunity.
- "Mark done" on a row moves it into Treatment Done for today's visit.

### PROF-18 · Treatment Done section [DESIGN]
- Rows: treatment, teeth, sitting note (pick from Sitting Note Templates for the treatment's category, SET-32, or type), doctor, charges, discount, GST (from the treatment's tax rate), net, total, files (attach images to this row).
- Saving creates billable items; "Bill now" creates the invoice (BILL-02) or leaves them for Bill & Collect / Auto Billing.
- Updates Charting (PROF-25): e.g. Root canal on 36 marks tooth 36 as RCT done.
- Lab-needed treatments (crown, denture…) offer "Send to lab" (ADM-23).

### PROF-19 · Package section [DESIGN]
Apply a package (SET-25) to this patient: shows included treatments and remaining counts; treatments done under the package are billed at package rules; package payment can be collected up front or in instalments.

### PROF-20 · Prescriptions section
- Red column headings: "Drug [+]" (the + adds a row), "Dosage", "Duration". "Apply template" button (Prescription Templates, SET-38) [DESIGN].
- Each medicine row: a small person icon [CONFIRM — ours: switches adult/child dose note], searchable drug dropdown (Drug Master), drug form auto-filled (e.g. Tablet), round button for regular dosing or "SOS" (only when needed), three small boxes for Morning / Noon / Night amounts, a number + "Days" dropdown (Days, Weeks, Months), total quantity (auto-calculated, editable), red bin to delete, drag handle to reorder.
- Second line under each medicine: food timing dropdown (Before food, After food, With food, Empty stomach, Bedtime), language dropdown (English and the clinic's other languages, for the printed instruction), Instruction box, Notes box.
- Safety [DESIGN]: warn when a drug matches the patient's "Allergic to Drugs" or an allergy chip, and when the patient is marked Pregnant/Breast Feeding or on Antiplatelet therapy.
- Print on the Prescription letterhead with the SET-03 options (medical conditions, allergies, investigation, include composition); WhatsApp share as a PDF link.

### PROF-21 · Instructions section
Pick one or more from the Instructions master (SET-34, e.g. post-extraction care), edit the text for this patient, print or WhatsApp.

### PROF-22 · Saving a visit
Saves all sections together in one transaction; links to the appointment; updates "Recently Visited"; schedules the welcome-on-first-visit and feedback messages if enabled; recalls are recomputed (SET-22).

### PROF-23 · DOCS & IMAGES tab [DESIGN]
- Upload area (drag-drop or pick): images (JPG/PNG/HEIC), X-ray image exports, PDFs, scanned forms; size limit per file (default 20 MB) set by the platform.
- Each file: category (X-ray / IOPA, OPG, CBCT report, Photo — before/after, Lab report, Consent form, Prescription, Other), date, teeth (optional, tooth picker), visit link (optional), note.
- Grid of thumbnails with filters by category, tooth and date; viewer with zoom, rotate, brightness/contrast, side-by-side compare (before/after).
- Download, WhatsApp share (expiring link), delete per permission.
- Patient portal shows files only when "Show Files" is on.
- "Files" columns in visit tables link here. Files stored in private storage buckets with signed, expiring URLs.

### PROF-24 · MEMBERSHIP tab [DESIGN]
Memberships this patient (or their family) holds: plan name (SET-23), start and expiry dates, amount paid, benefits (discount %, included treatments with used/remaining counts), status; "Add membership" (creates an invoice), renew, cancel. Expiry and membership-treatment-expiry messages come from SET-10.

### PROF-25 · CHARTING tab [DESIGN]
- Dental chart (odontogram) laid out like the tooth picker, adult and baby rows. Each tooth shows conditions and work with colours/icons: caries (cavity, by surface), missing, filled/restored, crown, bridge, RCT done, implant, extraction planned, fractured, mobility, other. Click a tooth → side panel: history of findings, plans and treatments for that tooth.
- Planned vs done shown differently (outline vs filled).
- Perio chart: per tooth, six sites, probing depth and recession values 1–15 using the colours/text from SET-35; bleeding on probing, mobility, furcation; summary of sites ≥ 4 mm.
- Head charting (only when "Enable Head Charting" is on, SET-01): face/head diagram where the doctor can mark and annotate areas (TMJ, swelling, lesions).
- Orthodontic record (for patients with orthodontic treatment): goals and limitations chosen from SET-39/SET-40, notes, progress photos link.
- The AI assistant can propose chart changes (AI-06).

### PROF-26 · Printing a visit / case sheet
Print icon per visit and the profile printer icons produce PDFs with the letterhead: visit case sheet (one visit) or full case sheet (lifetime), patient profile (with the Patient Profile footer).

### PROF-27 · Lifetime export [DESIGN]
Owner/doctor can export a patient's full record (PDF + files ZIP) — also used to answer a patient's data request under the DPDP Act (AGENTS.md §2).
