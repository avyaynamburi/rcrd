# 09 · Admin (ID-card icon)

Source: description Part 9, Part 11 (Access Audit, Payment Gateway Transactions, Recurring Task, SMS/WA Transfer not opened). Most Admin pages are entry forms (a short column of boxes and a navy SAVE). Every entry form also gets a history list of past entries (view / edit / delete per permission) [DESIGN] — BestoSys only showed the forms.

Accounting rule: all money screens post to one double-entry ledger (debits = credits for every voucher). Voucher numbers run per center per financial year, prefixed by type (INV, RCT, RFD, CN, PMT, JV…), with the reset option in SET-01.

### ADM-00 · Admin menu map
Second menu with seven groups (all may be open at once):
- Team: Doctor Unavailability, Access Audit
- NABH: About NABH, Biomedical Waste, Fumigation, Sterilization, Spore Test, Equipment Master, Equipment Maintenance, Equipment Breakdown
- Accounting: Credit Notes, Settlements, Payment Receive, Payment Gateway Transactions, Payment Made, Cash/Bank, Journal, Opening Balances
- Inventory: Purchase, Consume, Transfer
- Lab: Lab Bill, Give & Receive Lab Work
- Tasks: Recurring Task
- SMS/WA: SMS/WA Transfer

## Team

### ADM-01 · Doctor Unavailability
Standard list: Center dropdown, Status dropdown, View / Reset, + New. Columns: Doctor, Center, From, To, Reason, Active. + New opens the same form as the calendar's Doctor Unavailable tab (CAL-29).

### ADM-02 · Access Audit
See ACC-12.

## NABH (licensed module)

### ADM-03 · About NABH
Navy banner "NABH Compliance", heading "How Rcrd Supports Your NABH Compliance", our own explanation text (NABH is India's accreditation board for hospitals and healthcare providers, which needs detailed record keeping: sterilisation, waste, equipment, infection control), and a grey box with credits and a disclaimer (Rcrd helps keep records; it does not grant accreditation).

### ADM-04 · NABH licence gate
If the center's NABH module isn't active, opening any other NABH page shows a small box: "Rcrd — Your NABH module is expired. Please renew" with a red "Later" button and a "Renew Now" button (sends a renewal request to Rcrd, PLAT-03). When active, the registers below work.

### ADM-05 · Biomedical Waste register [DESIGN]
Date, center, waste category by colour bag (Yellow, Red, White/translucent sharps, Blue glassware — per India's Bio-Medical Waste Management Rules 2016), weight (kg), handed over to (authorised agency), manifest/receipt number, staff, verified by, notes, file upload. Monthly summary and export.

### ADM-06 · Fumigation register [DESIGN]
Date, center, area/room, method/chemical, concentration, duration, done by, verified by, next due date, notes.

### ADM-07 · Sterilization register [DESIGN]
Autoclave cycle log: date, center, autoclave (from Equipment Master), cycle number, load contents (instrument sets), temperature, pressure, holding time, chemical indicator result (Pass/Fail), operator, notes. Failed cycles flagged red; instruments from a failed load must be re-sterilised.

### ADM-08 · Spore Test register [DESIGN]
Date, center, autoclave, test type (biological indicator), incubation result date, result (Pass/Fail), reported by, action taken.

### ADM-09 · Equipment Master [DESIGN]
Equipment name, type (autoclave, dental chair, X-ray unit, compressor, suction, RVG sensor…), serial number, center, location, purchase date, vendor, cost, warranty expiry, AMC vendor and expiry, maintenance frequency, active. Expiries feed Dashboard → Tasks reminders.

### ADM-10 · Equipment Maintenance and Breakdown [DESIGN]
- Maintenance: equipment, date, type (preventive / AMC visit / calibration), done by, cost, next due date, notes, files.
- Breakdown: equipment, date and time, issue, reported by, action, resolved date, downtime (hours), cost, notes.

## Accounting

### ADM-11 · Credit Notes
Filter row: From [date] to [date], Date dropdown (Today, Yesterday, This week, This month, Custom), Center, Doctor, Voucher Status (Active / Cancelled); View / Reset; "+ New" far right. Credit note form [DESIGN]: center, date, patient, against invoice (optional), doctor, amount, GST reversal, reason, notes. Adds credit to the patient's balance.

### ADM-12 · Settlements
Filter row: From / to dates, Date dropdown, Center, Account Type, Account, Voucher Status; View / Reset; "+ New". Settlement form [DESIGN]: record money moving from a collection account into the bank — e.g. card-machine batch settled into a bank account (amount, bank charges/MDR deducted), wallet/UPI settlement, doctor settlement of remuneration. Posts to the ledger.

### ADM-13 · Receive Payment
Date and Center at the top; "Received From" round buttons Patient / Ratecard (corporate tie-up pays); Patient box (search) or Ratecard dropdown; Doctor dropdown; "Payment": Amount and mode round buttons Cash, Chq/Online, Card, Wallet, Other (+ account sub-dropdown and reference no.); Notes; SAVE. Payment is applied to the oldest unpaid invoices first, or stored as an advance (credit) if nothing is due [DESIGN]. Prints/WhatsApps the receipt.

### ADM-14 · Payment Gateway Transactions [DESIGN]
List of online payments received through the gateway (later, BILL-06): date, patient, amount, gateway reference, status (Success / Failed / Refunded), linked receipt. Until a gateway is connected the page explains that it's not set up.

### ADM-15 · Payment Made (money the clinic pays out)
Date and Center; "Upload your Files" button (max 5 MB per file); "Made to" round buttons Vendor / Doctor or Staff (payments other than compensation) / Expense Account; matching dropdown (Vendor, person, or expense account from SET-53); payment mode round buttons (+ account); Amount; GST input credit fields when a bill is attached [DESIGN]; Notes; "Print Payment" tick box (prints a payment voucher on save); SAVE.

### ADM-16 · Cash/Bank Transaction
Date; round buttons Withdrawal, Deposit, Transfer; Select Bank dropdown (and To Bank for Transfer); Cheque/Ref No and Cheque/Ref Date; Amount; Note; SAVE.

### ADM-17 · Journal Entry
Center and Date; "Debit A/C" with round buttons Doctor/Staff, Vendor, Account and a dropdown; "Credit A/C" with the same buttons, a dropdown and an Amount; Note; SAVE. Used for adjustments.

### ADM-18 · Opening Balances
Opening Balance Date top-left; five tabs PATIENT, DOCTOR, VENDOR, ACCOUNT, INVENTORY. Each tab is a list (e.g. "Patient Opening Balance") with Center dropdown, View / Reset, + New (party/account/item, amount, debit/credit or quantity and value). Main use: moving balances over from BestoSys at go-live (IMP-01).

## Inventory

### ADM-19 · Inventory Purchase
Center and Bill Entry Date; Select Vendor, Bill No., Bill Date. Item grid: Item (searchable stock items), Last Price (auto), Price, Qty, Disc, Net, Tax Amount, Total, Notes (+ batch and expiry when the item tracks them [DESIGN]); + on the right adds a row, red bin removes one. Near the bottom: "Others" amount, Particulars box, totals row; Notes; "Upload your Files"; RESET and SAVE. Increases stock; adds to the vendor's balance.

### ADM-20 · Inventory Consume
Center and Consumption Date; rows of Inventory Item, Stock on hand (shown), Quantity, Note, with a green + and a red bin; Note box; RESET and SAVE. Reduces stock (cannot go below zero without owner override).

### ADM-21 · Inventory Transfer
From Center, To Center, Transfer Date; rows of Inventory item, Stock in hand, Quantity; Notes; RESET and SAVE. Moves stock between branches.

## Lab

### ADM-22 · Lab Bill
Center and Bill Entry Date; Select Lab dropdown (vendors with Lab = Yes) and Bill No.; Bill Date; amount and link to lab works covered [DESIGN]; large "Upload your Files" area; RESET and SAVE. Adds to the lab's balance and to Lab Charges (DASH-02).

### ADM-23 · Give & Receive Lab Work
Page "Lab Work": Center dropdown and Select Lab dropdown side by side; two tabs Give and Receive.
- Give: "Giving to person" box (lab pickup person), plus [DESIGN] patient, doctor, work type (crown, bridge, denture, aligner, night guard…), teeth (tooth picker), shade, material, due date, instructions, attachments; RESET and GIVE. Prints a lab slip.
- Receive [DESIGN]: list of outstanding work for the selected lab; tick items received, received date, received by, notes; SAVE. Sends the "lab work received" patient message if enabled. Overdue items show in Dashboard → Lab Task.

## Tasks

### ADM-24 · Recurring Task [DESIGN — not opened]
List + form: task title, assigned to, center, repeat rule (daily / weekly on days / monthly on date), start and end dates, time, notes, active. Generates tasks automatically (calendar task cards, Dashboard → Tasks). Example: "Autoclave spore test every Monday".

## SMS/WA

### ADM-25 · SMS/WA Transfer [DESIGN — not opened]
Move message credits between centers of the same organisation: From Center, To Center, channel (SMS / WhatsApp), credits; shows both balances; SAVE. History list underneath.
