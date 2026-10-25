# 11 · Reports [DESIGN — the Reports icon was never opened]

Source: description Part 2 icon 4, Part 11. Every report uses the standard list layout (UI-01) with filters (date range, center, doctor, and report-specific ones), a table, an optional chart, totals, and Excel / PDF / Print (blocked by ACC-10). Access needs "View Report" on the matching area (ACC-06). Show these to the clinic early; they will want changes.

### RPT-00 · Reports home
Reports grouped in a left menu (same second-menu style): Appointments, Patients, Clinical, Financial, Doctor, Expenses & Lab, Inventory, Accounts, CRM & Messaging. Search box to find a report. Owner can star favourites.

### RPT-01 · Appointment reports
Appointments by status / doctor / center / category / day; no-show and cancellation rates; average waiting time (check-in → engaged) and chair time (engaged → check-out) from CAL-36; online vs front-desk bookings; operatory utilisation.

### RPT-02 · Patient reports
New patients by period and source type/source (referral performance); active vs inactive; birthdays and anniversaries this month; patients by group, ratecard, locality; patients with no visit in N months.

### RPT-03 · Clinical reports
Treatments done by category / treatment / doctor; treatment plans proposed vs accepted vs done (value and count); prescriptions by drug; diagnoses frequency.

### RPT-04 · Financial reports
Daily collection by payment mode and account (day-end cash tally); invoices register; receipts register; refunds and credit notes; discounts given (by doctor, by reason); patient dues with ageing (0–30, 31–60, 61–90, 90+ days); advances held; membership and package sales.

### RPT-05 · GST reports
Outward supplies summary by GST rate and HSN/SAC, CGST/SGST/IGST split, exempt vs taxable — laid out to help the clinic's accountant file GST returns (B2B/B2C split). Input tax credit from purchases and expenses.

### RPT-06 · Expenses and lab reports
Payments made by account/vendor; lab bills and lab work turnaround (given → received days, overdue); vendor balances.

### RPT-07 · Doctor remuneration report
Per doctor per period: treatments/collections counted, remuneration basis and rate (SET-28), insurance %, amount due, amount paid (settlements/payment made), balance.

### RPT-08 · Inventory reports
Stock on hand by center and item (value), purchases, consumption, transfers, low stock, expiring batches, item movement history.

### RPT-09 · Accounting reports
Day book, ledger for any account/party, trial balance, profit & loss, balance sheet, cash and bank books — for the selected financial year and center(s).

### RPT-10 · CRM and messaging reports
Recall conversion (recall sent → appointment booked), campaign results (CRM-05), call outcomes by tele-caller, message usage (links to CRM-07).

### RPT-11 · NABH registers export
Printable registers for audits from ADM-05 … ADM-10 by month.
