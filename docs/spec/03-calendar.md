# 03 · Calendar and appointments

Source: description Layout A, Part 3, Part 11 (unseen views/tabs). The Calendar is the home screen and the most-used screen; it must be fast and never lose a booking.

Appointment statuses: Scheduled → Checked-In → Engaged (in the chair) → Checked-Out. Side statuses: Missed (no-show), Cancelled. Every status change stores who and when (CAL-36).

### CAL-01 · Home screen
After sign-in, users with appointment access land on the Calendar for their current center (SHELL-15).

### CAL-02 · Waiting-room icon [CONFIRM]
Grey "group of people" icon at the left of the calendar top bar (about x = 825). Function not shown. Our version: opens a small list of patients currently Checked-In / Engaged with waiting time, so the front desk sees who is waiting.

### CAL-03 · Patient search box
- Search box with magnifier on the left and x on the right (about x = 850–1145).
- Typing (name, patient number or phone) drops a panel of matches: "Name (patient number)", grey line "Last Appt: date [doctor name]", and a small calendar icon on the right of each result.
- Clicking a name opens the patient's profile; clicking the calendar icon opens New Appointment with that patient filled in.

### CAL-04 · Compact mode switch
"Compact mode" on/off switch: smaller slot height and one-line cards so a full day fits on screen. Remembered per user.

### CAL-05 · Center dropdown
Shows the current branch (e.g. "Bellandur" / "RBI Layout"); changing it reloads the calendar with that branch's appointments. Only branches the user can access.

### CAL-06 · Doctors dropdown
"All Doctors" dropdown with a "Search doctors..." box at the top, then "All Doctors", then each doctor. Filters the grid and the Today panel.

### CAL-07 · "+ New" button
Navy button opening the New Appointment form (CAL-25).

### CAL-08 · Calendar toolbar
- Left: < and > arrows (move one period back/forward in the current view), then the start date as text with a down arrow, e.g. "Sunday Aug, 2 2026 ▾", which opens a date picker to jump.
- Right: outlined buttons Today, Day, Week, Month, Schedule, Doctor / Operatory. The active view has a darker outline.

### CAL-09 · Week view
- Seven day columns (about 75% of the width). Header row: day name in small capitals (SUN … SAT) with the date number under it.
- Today's number sits in a filled navy circle; today's whole column is shaded light peach.
- First day of the week follows the "Weekly View Start" setting (e.g. "Yesterday" = a rolling week starting yesterday; also Today, Sunday, Monday).

### CAL-10 · Time ruler and clinic hours
- Thin ruler on the left with tiny grey times at every slot (slot length from setting, default 15 minutes), covering the full day from 12:15 am.
- Hours outside the center's / doctor's working hours, holidays and doctor-unavailable blocks are greyed out.
- On open, scroll to the clinic's opening time.

### CAL-11 · Current-time line
Thin blue line with a dot at its left end across today's column at the current time, moving live.

### CAL-12 · Appointment cards
- Rectangle whose height matches the appointment length. Style from settings: Filled or Strip; colour by Doctor or Treatment Category; optionally changes colour by status.
- Three lines of white text: (1) bold — status icon + patient name (clock = scheduled, arrow = checked out, distinct icons for checked in, engaged, missed, cancelled); (2) italic — doctor name; (3) start time and length, e.g. "3:30p 30mins".
- Overlapping appointments sit side by side sharing the column width.
- Cancelled appointments are hidden from the grid by default (toggle to show) but counted.

### CAL-13 · Day view
One day; appointments stretched across the full width.

### CAL-14 · Schedule view
List grouped by date: on the left a navy circle with the date number and "AUG, MON" beside it; on the right full-width bars, one per appointment, with name, doctor and time.

### CAL-15 · Month view [DESIGN]
Month grid; each day shows up to 3 appointment chips and "+N more"; clicking a day opens Day view.

### CAL-16 · Doctor / Operatory view [DESIGN]
One day with one column per doctor (toggle to one column per operatory/chair). Same cards and interactions as Day view. Lets the front desk see chair usage.

### CAL-17 · Click an empty slot
Opens New Appointment with center, date, time (and doctor/operatory in CAL-16) prefilled [DESIGN].

### CAL-18 · Drag to move or resize [DESIGN]
Drag a card to another time/day/doctor column to reschedule; drag its bottom edge to change length. Same availability checks and "date/time changed" message as editing. Needs Appointment edit permission.

### CAL-19 · Appointment pop-over
Clicking a card opens a white card about 290 × 450 px beside it, with a small x top-right. Top to bottom:
1. Arrow icon (opens the profile) + patient name in bold, gender and age, patient number (#…).
2. Phone number with three icons under it: copy (to clipboard), green location pin (opens the patient's address in Google Maps), green WhatsApp icon (opens the message composer for this patient, MSG-06).
3. Small red label "Payment Due", the amount in large text ("INR 0.00"), a credit-card icon on the right (tooltip "Receive payment" → Receive Payment form ADM-13 for this patient) and an underlined "Bill & Collect" link (CAL-33).
4. Box with a coloured left edge: doctor name, start time with "today" when it's today, and the length on the right.
5. Action links: Edit (CAL-32), Missed (CAL-20), Check-In, Cancel Appointment (CAL-21), Copy (pick a new slot; creates a copy). After check-in the list offers Engage and Check-Out [DESIGN]. After check-out it shows Undo Check-Out and Copy instead.

### CAL-20 · Missed
Marks the appointment Missed (no-show), sends the "missed appointment" message if enabled, and adds the patient to CRM → Patient Tracker → No Show.

### CAL-21 · Cancel appointment
Confirmation box with an optional reason; status Cancelled; sends the "cancelled" message if enabled; patient appears in Patient Tracker → Cancelled.

### CAL-22 · Today panel
Right-hand column about 345 px wide (x ≈ 1565–1910). Top to bottom:
- Small ">" arrow on the left to collapse the panel (remembered), "Today" centred.
- Tabs: Appointments (underlined when active), Online, Follow ups.
- Six counter tiles: navy Total, dark grey "Sch", red "In", orange "Eng", green "Out", grey "Canc"; a circular refresh arrow after them.
- Two collapsed filter rows with down arrows: "Treatment Categories" and "Doctors" (multi-select).
- Yellow warning strip, e.g. "4 patients haven't checked-in yet!" = appointments whose start time has passed and are still Scheduled.
- Scrolling list of today's patients. Each row: coloured strip on the left edge (doctor/category colour), bold patient name, small clock icon with time and length, small red box with "?" when no treatment category is chosen (click to choose), an undo arrow (undo the last status change), the status word on the right ("Sch" grey, "In" red, "Eng" orange, "Out" green, "Canc" grey) and a small arrow icon that moves the patient to the next status (check-in → engage → check-out).
- Clicking the name opens the profile.

### CAL-23 · Today panel → Online tab [DESIGN]
Appointment requests and self-bookings from the online links (PORT-01). Each row: patient name/phone, requested time, Accept (creates/confirms the appointment), Reschedule, Reject (sends a message).

### CAL-24 · Today panel → Follow ups tab [DESIGN]
Patients due a follow-up call today (recalls, treatment-plan follow-ups, no-shows). Each row: name, reason, phone/WhatsApp icons, call-status dropdown using Interaction Call Statuses (SET-27), next follow-up date.

### CAL-25 · New appointment form
Large white box (about 1000 × 650 px) in the middle; calendar behind darkens; red x top-right.
- Top tabs: Appointment, Task (CAL-28), Doctor Unavailable (CAL-29).
- Second tabs (under Appointment): Single Appointment, Appointment Series (CAL-30), Group Appointment (CAL-31).
- Rows, each with a grey label on the left:
  - WHERE: Center dropdown and Operatory (chair/room) dropdown side by side.
  - WHO: Doctor dropdown (full width). Under it a Patient search box; typing lists "Name (#number)"; once chosen the patient's mobile number shows inside the box with a phone icon. "+ New" button on the right for a quick new patient (minimum required fields, opens full form later).
  - PURPOSE: Treatment Category dropdown with search (Consultation, Cosmetic, Crown & Bridge, Dentures, Endodontics, Implants, Not Specified, Occlusal Therapy, Online Appointment, Oral Surgery, Orthodontics, Others, Paedodontics and the rest of SET-30). Treatment dropdown (searchable) showing only treatments of the chosen category (e.g. Cosmetic → Bleaching, Chemical Peel, Diastema Closure…). Notes box.
  - WHEN: Date box (calendar icon), Time box (clock icon), "Walk-In" button (sets date/time to now and checks the patient in on save). Under them Duration: 5 min, 10 min, 15 min, 20 min, 30 min, 45 min, 1 hour, 1 hour 30 min, 2 hours, 2 hours 30 min, 3 hours, 4 hours, 5 hours, 6 hours, Custom (minutes box). Default from the Appointment Duration setting.
  - NOTIFICATIONS: collapsed grey row "Patient: WA/SMS, Email on Reminder"; expands to tick/untick confirmation and reminder by WA/SMS and Email for this appointment (defaults from SET-10, SET-30 and the patient's DND choices).
- Bottom row: orange "Need Help?" left; CANCEL (outlined) and SAVE (navy) right.

### CAL-26 · Availability check
On save, if the time is outside the doctor's working hours at that center, on a holiday, or inside a doctor-unavailable block: warning box "Rcrd — Doctor is not available on selected date" with a red Close button and "Proceed anyway". Also warn (don't block) when the operatory is already booked at that time [DESIGN].

### CAL-27 · Save result
Green toast "Appointment added successfully!"; the appointment appears in the grid and Today list; counters and status circles go up by one on every open screen (realtime).

### CAL-28 · Task tab [DESIGN]
Create a task: title, assigned to (person), center, date, time, duration, notes, link to a patient (optional). Tasks show on the calendar as task cards using the Task Card colours (SET-02: background yellow, overdue orange, font grey) and appear in Dashboard → Tasks. Recurring tasks: ADM-24.

### CAL-29 · Doctor Unavailable tab [DESIGN]
Doctor, center (or all centers), from date-time, to date-time, reason. Shows as a greyed block on the calendar; listed under Admin → Team → Doctor Unavailability (ADM-01). Offers to list affected existing appointments so staff can reschedule them.

### CAL-30 · Appointment Series [DESIGN]
Pick a template from Settings → Appointment Series (SET-12) or enter: number of appointments, every N days/weeks/months, same time; preview all dates (with availability warnings), then create them together. Editing one asks "this one / this and following".

### CAL-31 · Group Appointment [DESIGN]
One slot, several patients (e.g. a family or a school screening camp): add multiple patients; each gets their own appointment record linked to the group so each can be checked in/out and billed separately.

### CAL-32 · Update Appointment (Edit)
Same form as New without the top tabs, filled with the appointment's details. Bottom-left: a small red link with the other branch's name (one per other branch the user can access) that moves the appointment to that branch (re-checks availability). Saving a changed date/time sends the "date/time changed" message if enabled.

### CAL-33 · Bill & Receive (from "Bill & Collect")
Box in the middle of the screen:
- Doctor dropdown across the top.
- Payment: Amount box and round buttons for mode: Cash, Chq/Online, Card, Wallet, Other. Choosing a mode shows a second dropdown of that mode's configured accounts (bank account, card machine, wallet, cash account) from SET-14…SET-19, plus reference number for Chq/Online.
- Notes box.
- Small table: Treatment, Charges, Tax, Total; blue + adds a row (searchable treatment list, price from patient's ratecard), red circle-minus removes one.
- "Auto Billing" tick box [CONFIRM]: when ticked, the table is filled automatically with today's Treatment Done items for this patient that aren't billed yet.
- CANCEL / SAVE. Save creates the invoice (BILL-02) and the receipt (BILL-03), updates Payment Due everywhere, and offers to print or WhatsApp the invoice.

### CAL-34 · Appointment confirmation
When "Activate Appointment Confirmation" (SET-02) is on, booking messages carry a confirm link (PORT-04); confirmed appointments show a small tick on the card and pop-over [DESIGN].

### CAL-35 · Live updates
All front-desk and doctor screens see new/changed appointments and status changes within a couple of seconds without refreshing (Supabase Realtime), so two receptionists can't unknowingly double-book.

### CAL-36 · Status timestamps
Store scheduled, checked-in, engaged and checked-out times with the user who changed each, for waiting-time reports (RPT-01) and the audit log.
