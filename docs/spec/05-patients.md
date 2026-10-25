# 05 · Patients — list and registration form

Source: description Part 5, Part 8.1 Clinic → Preferences → Patient Registration, Part 8.7.

### PAT-01 · Patient list tabs
Three tabs top-left: RECENTLY ADDED, RECENTLY VISITED, INACTIVE; the chosen tab has a navy underline.

### PAT-02 · Patient list top-right
Search box (name, patient number, phone, email, search tag), the status circles, the time, and a navy "+ New" button under them.

### PAT-03 · Patient rows
Each row about 50 px tall, full width:
- grey person outline or the patient's photo,
- name, with the patient number in grey underneath,
- phone number(s) in the middle,
- email in blue,
- far right: amount owed in red (e.g. "Due. 6,000.00") when there is one, and a small calendar icon (book an appointment).
Clicking the row opens the profile. Infinite scroll / pagination for thousands of patients.

### PAT-04 · Empty tab
Grey "Looks like there's nothing to show here", a red link "Can't find patient? Tap here." (searches everything: all tabs, inactive, other allowed branches) and a round navy + button (new patient).

### PAT-05 · Exports
Excel / PDF / print of the current tab and search, if the user's permissions allow (ACC-10).

### PAT-06 · Patient number
Automatic number per organisation (e.g. #1234), never reused. If "Custom Patient ID" (SET-01) is on, staff may type their own ID (unique check) or use a prefix pattern per center [DESIGN].

### PAT-07 · New patient form layout
- Takes over the whole screen; back arrow top-left.
- Six tabs across the top: BASIC INFO, CONTACT, INSURANCE, MORE, MEDICAL, DEMOGRAPHICS.
- Small < and > arrows on the far left and right edges go to the previous / next tab.
- Labels in a column on the left; input boxes in a column about 550 px wide to their right, usually two per row.
- Save is possible from any tab once required fields are filled; unsaved changes warn on leaving.

### PAT-08 · Tab 1 — BASIC INFO
- Photo box top-left (grey outline with a small blue pencil badge): upload a photo or take one with the webcam.
- Center (required) — full-width dropdown.
- Title dropdown (Mr, Mrs, Ms, Master, Baby, Dr…) + First/Full Name (required) | Surname.
- Middle Names | Suffix.
- Gender (required): round buttons Male, Female, Transgender, Unknown | Date Of Birth (required): round buttons "DOB" (date box) or "Age" (number box; stores an approximate DOB and marks it approximate).
- Marital Status dropdown. When Married: Anniversary date [DESIGN — needed for the Pre-Anniversary Offer and anniversary wishes].
- CONTACT: country-code dropdown (+91 default) + WhatsApp Number | country-code dropdown + Other Mobile; Personal Email | Work/Other Email (email domain autocomplete from SET-46).
- IDENTIFICATION: Nationality dropdown | National ID (Aadhaar Card Number); ID Type dropdown (Aadhaar, PAN, Passport, Driving Licence, Voter ID, Other). Aadhaar and ID numbers are stored encrypted and shown masked (XXXX XXXX 1234) except to users with edit rights who click "show".
- RELATIONSHIP: Patient Since (a ticked "New" box, a date defaulting to today, and a red x to clear) | Group dropdown (SET-43); Ratecard (required, default "Standard", SET-24); Search Tag box (free tags used by search).
- SOURCE: Source Type dropdown | Source dropdown (filtered by type; e.g. Ref by Patient → pick the referring patient, which also triggers the referral thank-you message). Source Types from SET-45 (Ref by Patient, Ref by Internal Drs/Staff, Ref by External Drs/Other, Website, Facebook, Google, WhatsApp, Email, SMS, Instagram, Shared via Mobile, Practo.com, JustDial, Pamphlets and more).
- NOTES: one wide text box.
- Duplicate warning [DESIGN]: if the mobile number or name + DOB matches an existing patient, show the match before saving with "Open existing" / "Save anyway".

### PAT-09 · Tab 2 — CONTACT
Form slides left and a new pane appears on the right:
- "Paste from center" outlined button: copies the selected center's address into the address fields.
- ADDRESS: Address line 1, Locality, State dropdown (Indian states and union territories; other countries free text), Area Code (PIN), Landmark.
- OTHER CONTACTS: Emergency contact name (+ phone [DESIGN]), Spouse Name, General Practitioner dropdown (SET-46).

### PAT-10 · Tab 3 — INSURANCE
"Primary Insurance": Company dropdown, Sub Company dropdown (filtered by company), Policy dropdown (filtered), Insurance Id Number box. "+ Add Another Insurance" link adds more blocks (secondary, etc.), each removable.

### PAT-11 · Tab 4 — MORE
- Family: link family members [DESIGN] — search a patient, choose relation (spouse, child, parent, sibling, other); links show on both profiles (PROF-05) and allow family membership plans.
- Notification preference tick boxes: "Standard Appointment Reminder" (ticked by default), "SMS DND", "Email DND" (do not disturb; also add "WhatsApp DND" [DESIGN]).
- Patient Tracker: "Excluded" tick box and "Exclude Note" box (excluded patients never appear in CRM tracker lists or bulk messages).
- Patient Portal Access switches: Show Treatments (on), Allow to Edit Profile, Show Treatments Charges, Allow to Edit Medical Conditions, Show Files (on). Defaults come from the clinic setting (SET-01).

### PAT-12 · Tab 5 — MEDICAL
Labelled rows, each a box with clickable grey chips under it (click to add/remove; chips come from the settings masters):
- Medical Conditions — chips from SET-41: Diabetes, Blood Pressure, Thyroid, Epilepsy, Heart Disease, Asthma, Dental History, Acidity, Cholesterol, Kidney Disease, Pregnant/Breast Feeding, on Antiplatelet therapy, on Steroid therapy.
- Dental Conditions — chips from SET-42: Bad Breath, Bleeding gums, Sensitivity, Discoloured teeth, Stained teeth, Fractured teeth, Missing teeth, Cracked teeth, Pain in the lower right back teeth, Pain in the lower left back teeth, Pain in the upper right back teeth, Pain in the upper left back teeth, Pain in the upper front teeth, Pain in the lower front teeth.
- Current Medications — text box.
- Allergies — "Allergic to" box (free text / chips: Penicillin, Sulfa, Latex, Local anaesthetic, NSAIDs…) and "Select Allergic to Drugs" box (multi-select from Drug Master, SET-33).
- Habits — collapsed row with a down arrow; expands to chips [DESIGN]: Smoking, Tobacco chewing, Gutka/Paan, Alcohol, Bruxism (teeth grinding), Nail biting, Mouth breathing, Thumb sucking, with optional frequency notes.
- Medical history keeps a "last updated" date (shown on the profile, PROF-10).

### PAT-13 · Tab 6 — DEMOGRAPHICS
- Demographics: Language (default English; drives the language of messages and printed prescription instructions), Religion, Occupation, Ethnic Group, Race — stacked dropdowns. All optional, never required.
- Other: Blood Group dropdown and DISC Profile dropdown (D, I, S, C personality styles used for patient communication) side by side.

### PAT-14 · Field rules from settings
Clinic → Preferences → Patient Registration (SET-02) sets each optional field to Mandatory (must fill), Prompt (warns if empty but allows save) or Optional. The form follows those rules. Required-by-design fields (Center, Name, Gender, DOB/Age, Ratecard) are always required.

### PAT-15 · Edit patient
Same form opened from the profile pencil, filled in; RESET and SAVE; changes logged in the audit trail.

### PAT-16 · Active / Inactive
Patients can be marked Inactive (profile "Change" link, PROF-09) with a reason; they move to the INACTIVE tab and are skipped by recalls and bulk messages.
