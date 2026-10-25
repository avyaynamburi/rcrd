# 14 · Patient portal and online booking

Source: description Part 5.2 Tab 4 and Part 8.1 (Patient Portal Access switches), Part 8.3 (Online Appointment Link: Appointment Request and Appointment Booking), Part 8.1 WA/SMS (feedback request, social-media link), Part 3.5 (Today panel → Online tab). Owner chose to include the patient portal and online booking.

### PORT-01 · Online appointment links
- Two public pages per center (links shown and copyable in SET-21):
  - Appointment Request: patient enters name, mobile, preferred date and time window, reason; creates an Enquiry and appears in the Today panel → Online tab (CAL-23) for staff to accept.
  - Appointment Booking: patient picks a treatment category, doctor (optional) and a free slot computed from working hours, holidays, unavailability and existing bookings; the appointment is created as "Online Appointment" category and shows in the Online tab for confirmation.
- Mobile number verified by one-time code (needs an SMS/WhatsApp provider; until then, staff confirm by phone and the page says so).
- Spam protection: rate limits and a simple challenge; no patient data shown on public pages.
- Simple, clinic-branded (logo, colours, address, map link), mobile-friendly.

### PORT-02 · Patient portal
- Patient signs in with mobile number + one-time code (or a secure link sent by the clinic, PROF-03 link icon).
- Shows, according to the patient's portal switches (PAT-11, defaults from SET-01):
  - Show Treatments: visits and treatments done, treatment plans.
  - Show Treatments Charges: amounts, invoices, receipts, balance due, pay link (BILL-06).
  - Show Files: files from Docs & Images (download).
  - Prescriptions and instructions (always shown when treatments are shown).
  - Upcoming appointments: view, request reschedule/cancel.
  - Allow to Edit Profile: update contact details and address (changes logged, staff notified).
  - Allow to Edit Medical Conditions: update medical/dental conditions, medications, allergies before the visit (marked "patient-reported" until a doctor reviews).
- Family: a parent can switch to linked children's records (family links, PAT-11).
- Data-rights requests [DESIGN]: patient can ask for a copy of their data or correction (DPDP), which creates a task for the owner.

### PORT-03 · Feedback and reviews
After check-out the "feedback request" message links to a short form (rating 1–5, comment). 4–5 stars → invite to post on the center's Google review link (SET-21); 1–3 → private feedback to the owner (task + notification).

### PORT-04 · Appointment confirmation link
When SET-02 "Activate Appointment Confirmation" is on, booking/reminder messages include a link: Confirm / Request change. Confirmed shows a tick on the appointment (CAL-34); change requests go to the Online tab.

### PORT-05 · Consent signing [DESIGN, optional]
Clinic sends a consent letter (SET-49) to the portal or opens it on a clinic tablet; patient reads, types their name and signs with finger/mouse; signed PDF saved to Docs & Images with time and device recorded.
