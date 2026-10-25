# 08 · Settings (gear icon)

Source: description Layout B, Part 8, Part 11 (Treatment, Prescription Template, Inventory Category not opened). Settings are owner-only by default (ACC-14). Most pages are standard lists (UI-01). "Seed" = default rows created for every new clinic (editable).

### SET-00 · Settings menu map
Second menu with ten groups, in this order:
- Practice: Clinic, Centers, Owner & Doctor, Staff, Holiday, Operatory, WA / SMS / Emails, My Gallery, Appointment Series, Project
- Payment Mode: Bank Account, Card Swiping Machine, Cash, Credit Card, Wallet, Others
- Practice Growth Setup: Branding, Social Media Integration, Repeat Visit Generator, Membership, Rate Cards & Corp Tie-ups, Packages, PROWA, Interaction Call Statuses
- Specialist Fees: Specialist Fees
- Electronic Medical Records: Clinical Notes, Treatment Category, Treatment, Sitting Note Template, Drug Master, Instructions, Perio Charting, Insurance, Insurance Master, Prescription Template
- Orthodontics: Goals, Limitations
- Patient Profile: Medical Conditions, Dental Conditions, Group, Source, Source Type, Referral, General Practitioner, Email Domains
- Templates: WA Messages, Email, Letter
- Inventory & Accounting: Vendor, Inventory Category, Inventory Item, Accounts
- Utilities: Patient Merge, Clear Cache And Logout

## Practice

### SET-01 · Clinic Setting — General Details
- Page title "Clinic Setting"; tabs GENERAL DETAILS, PREFERENCES, PRINTING SETUP, INTEGRATIONS. Outlined "Edit" button with a pencil top-right; everything is read-only (greyed) until Edit is pressed; then RESET / SAVE.
- Two logo spaces side by side, "Upload Logo 1" and "Upload Logo 2", each with a small pencil badge.
- Organization: Clinic Name, Billing Name, Tag Line (e.g. "Designing smiles since 2003"), Owner Name, Website.
- Global Settings: "Teeth No. System" round buttons FDI (default), Universal, Palmer; "Allow Vouchers From" date (no invoice/receipt/voucher may be dated before it — locks closed periods); switches: Reset Voucher Id on New Financial Year (Indian FY starts 1 April), Enable Head Charting (PROF-25), Custom Patient ID (PAT-06), Advanced Security with (i) explainer (ACC-16).
- Patient Portal Access defaults: Show Treatments, Allow to Edit Profile, Show Treatments Charges, Allow to Edit Medical Conditions, Show Files.

### SET-02 · Clinic Setting — Preferences
- Calendar Preferences: Weekly View Start (Yesterday, Today, Sunday, Monday; default "Yesterday"), Calendar Slot Duration (5, 10, 15, 20, 30, 60 Minute; default "15 Minute"), Appointment Duration (default "30 mins", same choices as CAL-25), "Activate Appointment Confirmation" switch with a small note explaining patients will get a confirm link (CAL-34).
- Appointment Card: Color Style round buttons Strip / Filled; Top Color round buttons Doctor / Treatment Category; a live "Preview" card on the right (Patient name, Operatory name, Doctor name, "12p 1hr"); "Change appointment card color on status change" Enable / Disable.
- Task Card: three colour dots with colour codes — Task Background (yellow), Overdue Task (orange), Task Font (grey); click to pick a colour.
- Patient Registration: one row per optional field of the patient form (SurName, Profile Pic, Mobile, Email, Date of birth, Locality / City, Aadhaar Card Number, Nationality, and every other optional field); each row has round buttons Mandatory, Prompt, Optional (default Optional, shown ticked in green). Drives PAT-14.

### SET-03 · Clinic Setting — Printing Setup
- Printing Setting: Print Paper dropdown — "Plain paper & letterhead" (print our letterhead on plain paper), "Pre-printed letterhead" (leave header space blank), "Plain paper" (no header).
- Letterhead Preference: header template dropdown ("Template With 1 logo", "Template With 2 logos", "Text only") with a live preview: clinic name, tag line and address on the left; phone, email and website on the right.
- Default Paper Size: Plain Paper Size (A4); Letterhead Sizes for Prescription, Treatment Plan, Bill/Receipt, Invoice — each a dropdown (A4, A5, B5).
- Margins: small grid, rows A4, B5, A5; columns Left, Top, Bottom, Right margin; each a dropdown in inches (0.25 to 3.00 in 0.25 steps; e.g. 1.25, 2.00, 0.50, 0.25).
- Font Size For All Prints: ten letter "A"s growing left to right over a slider with a red knob (10 steps).
- Additional Settings For Prescription: switches Medical Conditions, Allergies, Investigation, Include composition (prints drug composition under the name).
- Invoice: switches Include Doctor name in Invoice (on), Show GST column always, Include HSN/SAC Code in Invoice.
- Footers: text boxes for the bottom line printed on Invoice, Receipt, Refund, Credit Note, Prescription, Patient Profile.

### SET-04 · Clinic Setting — Integrations
Cards, one per integration, each with a short explanation, "How it works" link and an action button:
- Zoho Books Integration (Accounting): every invoice, receipt, return and refund is copied into Zoho Books automatically; paid add-on; "Order Now" sends a request to Rcrd (later phase, INT-01).
- WhatsApp provider, SMS provider, Email sending, Payment gateway (Razorpay) — status and connect/request buttons (configured by Rcrd platform admin, MSG-01, BILL-06).

### SET-05 · Centers
- "Center List": Center Name, City, Plan, Plan Expiry, Contact No., Contact Person, Center Email ID, Country Name, Active, SMS Balance, Google Map Link.
- Plan, Plan Expiry and SMS Balance are read-only for the clinic (managed by Rcrd, PLAT-02).
- Center form [DESIGN]: name, address (line, locality, city, state, PIN), country, phone, email, contact person, Google Map link, GSTIN (GST registration is per state, so each center has its own), timezone (default Asia/Kolkata), opening hours per weekday (used when no doctor hours apply), invoice number prefix.
- Seed for DENTALPROFILES at import: RBI Layout, Bellandur.

### SET-06 · Owner & Doctor
- List: Title, Name, Contact No., Email ID (Personal), Role, Active. "Deleted Owner & Doctor List" under it (ACC-18).
- "+ New" / Edit opens "Update Doctor/Owner" with three tabs:
  - BASIC INFO: picture with a pencil (cartoon doctor placeholder); Center(s); Title, Name, Middle Names, Surname, Suffix, Short Name (shown on calendar cards); Gender round buttons; Date of Birth; Contacts: two mobile numbers, personal email, work email; Role dropdown (Owner, Owner and Doctor, Doctor) with tick boxes Consultant, Orthodontist, Tele-caller, Marketing, Accountant; Registration: Regn No., Regn Authority (e.g. state dental council); Qualification, Specialty, Experience (Yrs); Description; Notifications: "Send Appointment Summary" (ticked by default); calendar colour [DESIGN — needed for "Top Color: Doctor"].
  - ACCESS: everything in ACC-02 … ACC-10 (Enable Login, Set New Password, Enable Mobile Access, Centers, Allowed to see appointments, Disable Export, Detailed Access grid with Select Copy Access from).
  - WORKING HOURS: one row per day Monday–Sunday: "Working" switch, Opening Time, Break Start, Break End, Closing Time. Below: "Special Working Hours 1" and "Special Working Hours 2", each with an Enable switch and a date range with its own times (e.g. Ramadan or exam-season timings) [DESIGN details]. Hours are per center when the doctor works at more than one [DESIGN].

### SET-07 · Staff
Full-width Center dropdown, Status + View / Reset. "Staff List": Title, Name, Contact No., Email, Role, Active. "Deleted Staff List" under it. Staff form has BASIC INFO (without clinical registration fields) and ACCESS tabs (and WORKING HOURS [DESIGN] for attendance later).

### SET-08 · Holiday
"Holiday List": Holiday Reason, Date, Recurring Holiday (Yes/No), Notes; center selection (one or all) [DESIGN]. Holidays grey out the calendar and trigger the availability warning (CAL-26). Seed: Independence Day (15 Aug, recurring), Republic Day (26 Jan, recurring).

### SET-09 · Operatory
Center dropdown, Status, View / Reset, + New. Operatory = chair or room: name, center, colour, active, notes. Used in the appointment form (CAL-25), the Doctor/Operatory view (CAL-16) and the card preview.

### SET-10 · WA / SMS / Emails (automatic notifications)
- Two long tables: "WA, SMS & Email to Patients" and "WA, SMS & Email to Doctors".
- Columns: Notification (a full sentence), SMS/WA (Yes/No toggle), Email (Yes/No toggle), Action (pencil = edit the message text with tokens; gear = settings).
- Changeable values inside sentences are highlighted (click to change): reminder times, "Appointment Day" / "Previous Day", "2 hrs", etc.
- Patient notifications (all of them):
  1. Appointment confirmation when booked
  2. Appointment date/time changed
  3. Appointment cancelled
  4. Appointment reminder — at 7:30 AM on the appointment day, or 8:00 PM the previous evening for early appointments (times and cut-off editable)
  5. Birthday wishes
  6. Thank-you to the patient who referred someone
  7. Recall message (from Repeat Visit Generator)
  8. Final reminder 2 hours before
  9. Missed appointment
  10. Invoice made today
  11. Receipt made today
  12. Lab work received
  13. Welcome on first visit
  14. Feedback request on checkout
  15. Payment reminder with link
  16. Anniversary wishes
  17. Membership expiry
  18. Membership treatment expiry
  19. Refund made today
  20. Social-media link
  21. Payment link
- Doctor notifications [DESIGN — not listed in the recording]: new appointment booked for me, my appointment changed/cancelled, daily appointment summary (ACC-17), online booking request received, lab work received for my patient, patient checked in for me.
- Per-category reminder timing overrides live on Treatment Category (SET-30).

### SET-11 · My Gallery [DESIGN]
Clinic image library: upload clinic photos, before/after cases (with patient consent), offer banners; folders; used when composing WhatsApp/email messages and in the patient portal.

### SET-12 · Appointment Series templates [DESIGN]
"Appointment Series Template List": template name, treatment category, number of appointments, interval (every N days/weeks/months), duration, notes, active. Used by CAL-30 (e.g. "Braces adjustment — 12 × monthly, 20 min").

### SET-13 · Project [CONFIRM]
Empty list in the recording; purpose unknown. Our version: projects group work outside normal appointments — dental camps, school screenings, corporate tie-up drives — with name, center, dates, linked patients/appointments and tasks, and an outcome summary. Confirm with the clinic before building beyond the list.

## Payment Mode
All are small standard lists; their rows appear as sub-options when choosing a payment mode (CAL-33, ADM-13, ADM-15).

### SET-14 · Bank Account
"Bank Accounts List": Bank Name, Branch, Account # (stored encrypted, shown masked), IFSC [DESIGN], Active. Used by Chq/Online, Cash/Bank transactions and settlements.

### SET-15 · Card Swiping Machine
Center dropdown; "Card Swiping Machine List": Machine Name, Issued By, Bank Name (settles into which bank account), Active, Notes.

### SET-16 · Cash
"Cash List": Account Type, Account, Search Words, Active, Default, Notes. Seed: "Cash in Hand" (default).

### SET-17 · Credit Card
List of the clinic's own credit cards used to pay expenses [DESIGN]: card name, issuing bank, last 4 digits only, active.

### SET-18 · Wallet
"Wallet List": wallet name, linked bank account, Active, Default, Notes. Seed: GPay, UPI (plus the clinic's own, e.g. two bank wallets, at import).

### SET-19 · Others
Other payment modes (e.g. insurance settlement, corporate credit) — same columns as Wallet.

## Practice Growth Setup

### SET-20 · Branding
Two navy bars, each with a pencil on the right:
- Global Preferences: clinic name used in SMS/WhatsApp messages.
- Center-wise Preferences: center dropdown, contact number shown in WA/SMS/Email, email sender name, reply-to email, CC email, SMS/WA Balance Alert Level (default 50 — alert owners when credits fall below).

### SET-21 · Social Media Integration
"Edit" button top-right.
- Online Appointment Link: two web links per center — Appointment Request and Appointment Booking — each with a copy icon (PORT-01).
- Social Media Links: Facebook Page, Instagram Page, JustDial, Other.
- Google Review Links: one box per center (used by "Reviews" on the profile and the feedback flow).

### SET-22 · Repeat Visit Generator (recalls)
One intro line, then four blocks, each with a bold label on the left and an explanation paragraph on the right:
- General Recall: "Periodicity" (default 183 days ≈ 6 months after the last visit), WA/SMS and Email switches, gear (timing/time of day), pencil (message).
- Treatment-Wise Recall: + button; table Name (treatment or category), Send Treatment Recall SMS (switch), Recall after (days); row icons gear / pencil / bin. Seed: Scaling — 180 days.
- Pre-Birthday Offer: message a week before the patient's birthday; WA/SMS and Email switches.
- Pre-Anniversary Offer: same for wedding anniversaries; SMS and Email switches.
Recall due dates feed Patient Tracker → Recall and the Today panel Follow ups tab.

### SET-23 · Membership plans [DESIGN]
List: plan name, price, validity (months), covers (individual/family, max members), benefits: discount % on treatments (per category), included treatments with counts (e.g. 2 scalings/year), active, notes. Sold from the patient's Membership tab (PROF-24).

### SET-24 · Rate Cards & Corp Tie-ups
"Ratecard List": ratecard name (seed "Standard"), type (Standard / Corporate tie-up / Insurance / Custom), company name for tie-ups, default discount %, per-treatment price overrides table, validity, active. A patient's Ratecard (PAT-08) decides their prices. Receive Payment can be "Received From: Ratecard" (corporate pays) (ADM-13).

### SET-25 · Packages [DESIGN]
List: package name, included treatments with quantities, package price, validity, GST handling, active. Applied in a visit (PROF-19).

### SET-26 · PROWA [CONFIRM]
BestoSys-specific growth add-on; content unknown. Build only the licensed-module shell: two tabs "About — must read before using" and "Preferences", a center dropdown, and when not enabled: "This module is not enabled for [center]. Please contact your Rcrd Growth Advisor." Fill in later if the clinic explains what it does.

### SET-27 · Interaction Call Statuses
"Manage Call Status": removable chips + "+ New". Seed: Call not received, Not Reachable/Switch Off, Disconnected call, Busy - Call Back, Call Back, Not Interested - Cost, Interested - Budget Issue. Used when logging follow-up calls (CAL-24, CRM-02).

## Specialist Fees

### SET-28 · Specialist Fees
"Specialist Fees List": Center dropdown, View / Reset; columns Doctor Name, Remuneration Basis (dropdown per row; default "Treatments & packages"; also "Collections", "Fixed per visit", "Fixed monthly" [DESIGN]), Remuneration (% or amount), Remuneration Insurance (%) for insurance-paid work. One row per doctor. Drives Dr Compensation (DASH-02) and doctor payout reports (RPT-07).

## Electronic Medical Records

### SET-29 · Clinical Notes master
"Clinical Notes Master List": Type, Notes, Active. Clicking a row opens "Update Clinical Notes Master": Type dropdown, Notes, Remark, Active tick box, CANCEL / SAVE.
Types: Complaints, Findings, Investigations, Diagnoses, Notes. Seed (28 from BestoSys plus a few findings):
- Diagnoses: Apical periodontitis, Pericoronal Abscess, Reversible Pulpitis, Irreversible Pulpitis, Periodontitis, Dental Caries, Missing Tooth, Fracture, Gingivitis, Peri Apical Abscess, Traumatic Ulcer, Aphthous Ulcer, Cracked tooth Syndrome, Non Vital Teeth.
- Investigations: CBCT, IOPAR, Bite Wing Radiograph, OPG.
- Complaints: Difficulty in chewing food, Cavity, Sensitivity, Discolouration, Ulcer, Pain, Swelling, Bleeding Gums.
(Remaining BestoSys rows come over in the data import.)

### SET-30 · Treatment Category
Search box and Status; columns Treatment Category, SMS, WA, Email (which reminder channels apply), Active, SMS/WA Before Hours, Email Before Hours (reminder lead time for this category). Category colour [DESIGN — needed for "Top Color: Treatment Category"].
Seed (18): Online Appointment, Not Specified, Occlusal Therapy, Crown & Bridge, Orthodontics, Endodontics, Restorative, Dentures, Oral Surgery, Scaling and Polishing, Periodontics, Implants, Cosmetic, Paedodontics, Consultation, Recall, Others, Remote Consultation.

### SET-31 · Treatment master [DESIGN — not opened in the recording]
List: Treatment name, Category, Default price (Standard ratecard), Tax rate (GST %), HSN/SAC code, Charge per (tooth / arch / full mouth / visit), Default duration, Lab work required (Yes/No), Default sitting count, Active, Notes. Seed examples: Cosmetic → Bleaching, Chemical Peel, Diastema Closure; plus a standard Indian dental treatment list. Tax: most clinical dental treatments are GST-exempt health care; cosmetic procedures are usually taxable — clinic's CA must confirm rates (BILL-02).

### SET-32 · Sitting Note Template
List: Treatment Category, Sitting Note Template (text). Seed examples: Crown & Bridge → "Cap Cementation Done", "Teeth Preparation Done For Zirconia Bridge" (BestoSys had 45 rows; the rest come over in the import). Used in Treatment Done (PROF-18).

### SET-33 · Drug Master
List: Drug Type (Tablet, Capsule, Syrup, Ointment, Gel, Mouthwash, Toothpaste, Injection…), Drug Name, Composition, Route of Admin, Active (BestoSys had 123 medicines; imported). Used by Prescriptions and allergy checks.

### SET-34 · Instructions master
"Instructions Master": Search and Status; list of instruction texts (title, body, language, active). Seed [DESIGN]: post-extraction care, post-RCT care, after scaling, new denture care, braces care, after implant surgery, after whitening.

### SET-35 · Perio Charting values
15 rows, one per gum-pocket depth value 1–15. Columns: Value, Probing Color, Probing Text, Preview, Recession Color, Recession Text, Preview, Notes, Action (edit). Seed colours: white/grey for 1–3, light blue for 4, purple for 5–6, bright red for 7–15 (deeper = worse). Used by the perio chart (PROF-25).

### SET-36 · Insurance
Three tabs: Company, Sub Company, Policy — each a standard list (company name; sub company under a company; policy under a sub company with coverage notes). Feeds the patient Insurance tab (PAT-10).

### SET-37 · Insurance Master
Read-only list managed by Rcrd (platform): Company Name, Website, Email, claim-form icon (download that insurer's claim form). BestoSys listed 17 insurers; Rcrd maintains its own list. Clinics can copy an insurer into their own Insurance → Company list.

### SET-38 · Prescription Template [DESIGN — not opened]
List: template name, linked treatment category (optional), drug rows exactly like the Prescriptions section (drug, regular/SOS, M/N/N, duration, food timing, instruction). Applied with one click in a visit (PROF-20). Seed: e.g. "Post extraction", "Post RCT", "Dental abscess (adult)".

## Orthodontics

### SET-39 · Orthodontic Goals
"Orthodontic Goals List": Goal, Active, Notes. Seed (12): Straighten Teeth, Deep bite correction, Close spaces, Correct crowding, Correct overjet, Correct open bite, Correct cross bite, Correct midline, Improve smile aesthetics, Improve function/chewing, Level and align arches, Correct molar relationship. [CONFIRM the clinic's exact 12 at import.]

### SET-40 · Orthodontic Limitations
"Orthodontic Limitations List": Limitation, Active, Notes. Seed (8): Deep Bite, Missing teeth at particular positions, Cross bite, Skeletal discrepancy, Periodontal compromise, Root resorption risk, Patient compliance, Short roots. [CONFIRM at import.]

## Patient Profile masters

### SET-41 · Medical Conditions
Title, "+ New", conditions as removable chips. Seed: Diabetes, Blood Pressure, Thyroid, Epilepsy, Heart Disease, Asthma, Dental History, Acidity, Cholesterol, Kidney Disease, Pregnant/Breast Feeding, on Antiplatelet therapy, on Steroid therapy. Exactly these chips appear on PAT-12.

### SET-42 · Dental Conditions
Same layout. Seed: Bad Breath, Bleeding gums, Sensitivity, Discoloured teeth, Stained teeth, Fractured teeth, Missing teeth, Cracked teeth, Pain in the lower right back teeth, Pain in the lower left back teeth, Pain in the upper right back teeth, Pain in the upper left back teeth, Pain in the upper front teeth, Pain in the lower front teeth.

### SET-43 · Group
"Patient Group List": Patient Group, Icon, Active, Discount (%, applied on bills for that group). Seed (7): None, Doctor, VIP, Family, Prospect, Prospect - Inactive, Friends.

### SET-44 · Source
List of specific sources under a source type (e.g. a particular camp, a referring external doctor, a campaign): Source, Source Type, Active, Notes.

### SET-45 · Source Type
"Patient Source Type List" (26 in BestoSys): Source Type, Active. Seed: Ref by Patient, Ref by Internal Drs/Staff, Ref by External Drs/Other, Website, Facebook, Google, WhatsApp, Email, SMS, Instagram, Shared via Mobile, Practo.com, JustDial, Pamphlets, Camp, Walk-in, Word of Mouth, Hoarding/Banner, Newspaper, Radio, YouTube, Corporate Tie-up, Insurance, School Screening, Existing Patient Family, Other. [Remaining exact names come from the import.]

### SET-46 · Referral, General Practitioner, Email Domains
- Referral: list of referring external doctors/clinics (name, clinic, phone, email, specialty, active) — used as Source under "Ref by External Drs/Other".
- General Practitioner: list of family doctors (name, clinic, phone, email) for the patient Contact tab.
- Email Domains: list of domains (gmail.com, yahoo.com, outlook.com, rediffmail.com…) for email autocomplete.

## Templates

### SET-47 · WA Messages templates
"WA Template List": Template Name, Folder, Notes, Active; editor with body, tokens (same token list as SET-49), language, and WhatsApp approval status (Draft / Submitted / Approved / Rejected — WhatsApp Business API requires Meta-approved templates for business-initiated messages). Seed (27 in BestoSys): festival greetings — Diwali, Holi, Onam, Pongal, Ugadi, Sankranti, Eid, Christmas, New Year, Independence Day, Republic Day, Ganesh Chaturthi, Dussehra, Raksha Bandhan, Navratri, Good Friday/Easter, Mother's Day, Father's Day, Women's Day, Children's Day, Teachers' Day, Doctors' Day, World Oral Health Day — plus clinic messages: Clinic Address, COVID-19 Questionnaire, Clinic Timings, Holiday Notice. [Exact set from import.]

### SET-48 · Email templates
"Email Template List" (2 in BestoSys): name, subject, rich-text body with tokens, folder, active. Seed: Welcome email, Appointment details email.

### SET-49 · Letter templates
- "Letter Template List": 14 consent forms in folder "Dental Consents Form": Covid Consent, consent for wisdom tooth surgery, dental implants, gum surgery, root canal, general dentistry, children's dentistry, fillings, crowns and bridges, local anaesthesia, extractions (plus the remaining BestoSys ones from import). Consent wording must be reviewed by the clinic's dentists — we write neutral drafts, never legal advice.
- "Update Letter Template": Template Name, Folder, Subject at the top; large rich-text Body editor on the left; scrollable "Tokens" list on the right — PatientID, Salutation, PatientFirstName, PatientMiddleName, PatientSurName, PatientName, PatientMobile, PatientEmail, PatientAge, PatientGender, PatientAddress, Today, DoctorName, ClinicName, CenterName, CenterAddress, AppointmentDate, AppointmentTime, AmountDue. Clicking a token inserts it at the cursor; tokens are filled automatically when the letter is generated for a patient.
- Optional [DESIGN]: patient signs on a tablet; signed PDF saved to Docs & Images → Consent form.

## Inventory & Accounting masters

### SET-50 · Vendor
"Vendor List": Vendor Organization Name, Lab (Yes/No — labs appear in Lab dropdowns), Active, Area Code, Land Line, Title, Primary Contact Name, Contact No., Email, Balance (amount we owe, from purchases/lab bills minus payments made). Form adds GSTIN, address, bank details [DESIGN]. (9 vendors/labs come over in the import.)

### SET-51 · Inventory Category [DESIGN — not opened]
List: category name, active, notes. Seed: Consumables, Restorative materials, Endodontic materials, Impression materials, Instruments, Sterilisation, Orthodontic, Prosthodontic, Surgical, Medicines, Office supplies.

### SET-52 · Inventory Item
"Inventory Item List": Inventory Category dropdown and Search box; columns Item, Category, Preferred Brands, HSN Code, Tax Rate, Unit of Measure Code / Description, Notes, Active. Extra [DESIGN]: reorder level per center, track batch/expiry (Yes/No). (268 items come over in the import: gloves, syringes, gauze, filling materials…)

### SET-53 · Accounts (chart of accounts)
"Account List": Account Type dropdown and Status; columns Account Type, Account, Account Group, Search Words, Active, Default, Notes. Groups: Expenses, Assets, Liabilities, Owner's Equity, Income. Seed: a standard Indian clinic chart of accounts (rent, salaries, electricity, lab charges, dental materials, doctor remuneration, GST payable, TDS payable, bank charges, treatment income, membership income, owner capital…); BestoSys had 140 accounts — the clinic's own come over in the import.

## Utilities

### SET-54 · Patient Merge
- One "Original Patient" row and four "Duplicate Patient" rows; each has a Select Center dropdown and a patient search box.
- Red note: merging moves all appointments, clinical data, money records and messages from the duplicates into the original, then permanently deletes the duplicates.
- Navy MERGE button; confirmation box shows what will move (counts per type). Owner only; fully logged (the audit log keeps the merged-away patient numbers).

### SET-55 · Clear Cache And Logout
Menu action (no page): clears this browser's cached data and local settings for Rcrd, signs out, and reloads to the newest app version.
