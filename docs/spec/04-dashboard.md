# 04 · Dashboard

Source: description Part 2 (icon 1), Part 4, Part 11 (Lab Task, Tasks, Payment Due tabs not shown).

### DASH-01 · Dashboard top bar
Right side: "Select Center" dropdown (all allowed centers + "All Centers" for owners) and the status circles (SHELL-06).

### DASH-02 · Practice Summary card
Top half of the screen, white card.
- Title "Practice Summary", grey line under it: "Gross, Discount, Lab Expenses & Remuneration".
- "Doctor" dropdown top-right (All Doctors + each doctor).
- Period selector [DESIGN]: This month (by day), Last 12 months (by month), custom range.
- Colour key in a row: Net Amount (green bars), Discount (yellow bars), Lab Charges (red bars), Dr Compensation (dark bars), No. of Treatments (blue line).
- Combined chart: bars against the left axis "Amount" (INR), line against the right axis "Treatments".
- Definitions: Net Amount = invoiced amount after discount; Discount = discounts given; Lab Charges = lab bills (ADM-22) in the period; Dr Compensation = remuneration from Specialist Fees (SET-28); No. of Treatments = Treatment Done items.
- Empty state: "Looks like there's nothing to show here".
- Money figures only for users with View Report on Billing; others see the treatments line only.

### DASH-03 · "Things that need your attention" card
Bottom half.
- Tabs: Inventory (underlined when active), Lab Task, Tasks, Payment Due.
- Under the tabs a small "Status" dropdown (Active / Done / All).
- Inventory: items below their reorder level or near expiry (SET-52), with stock on hand and a link to Purchase.
- Lab Task [DESIGN]: lab work given (ADM-23) not yet received, overdue first, with lab name, patient, work, due date; "Mark received".
- Tasks [DESIGN]: open tasks (CAL-28, ADM-24) assigned to me (or all for owners), overdue in the Overdue Task colour; "Mark done".
- Payment Due [DESIGN]: patients with an outstanding balance, largest first, with amount, last visit, phone/WhatsApp icons and "Send Payment Link".
- Empty: "Looks like there's nothing to show".
