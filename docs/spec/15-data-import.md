# 15 · Importing data from BestoSys

Source: owner's choice to import the clinic's existing data; description Part 7.1 (every list page has an Excel export) and Part 9.2 (Opening Balances). The first clinic (DENTALPROFILES, branches RBI Layout and Bellandur) moves over from BestoSys.

### IMP-01 · What to import, in order
1. Masters: centers, owners/doctors/staff (no passwords — everyone gets an invite), operatories, holidays, treatment categories, treatments and prices, ratecards, groups, source types/sources, referrals, GPs, clinical notes master, sitting note templates, drug master, instructions, prescription templates, perio values, insurance companies/policies, ortho goals/limitations, WA/email/letter templates, vendors/labs, inventory categories/items, chart of accounts, bank accounts, card machines, wallets.
2. Patients (with BestoSys patient numbers kept as their Rcrd patient numbers or as "old ID" — owner chooses), contact, medical, demographics, insurance.
3. Appointments (past and future).
4. Visits: clinical notes, treatments done, prescriptions (as far as BestoSys exports allow).
5. Money: invoices and receipts if exportable; otherwise each patient's balance as a Patient Opening Balance (ADM-18), and vendor/account/inventory opening balances.
6. Files: if X-rays/photos can be bulk-downloaded, match them to patients by number/name.

### IMP-02 · Import wizard (owner only)
Upload .xlsx/.csv → choose the target (e.g. "Patients") → map columns (auto-suggest by header name; save the mapping for re-use) → preview with per-row validation errors → dry run summary (will create N, update M, skip K) → commit. Each import is a batch with a log; an owner can roll back a whole batch.

### IMP-03 · Safe re-runs
Every imported row keeps an `external_source` + `external_id`; re-importing updates instead of duplicating, so the final export just before go-live can be loaded on top of an earlier rehearsal.

### IMP-04 · Duplicates
After the patient import, a duplicates report (same mobile, or same name + DOB) with one-click handoff to Patient Merge (SET-54).

### IMP-05 · Handling real data
Export files contain real patient data: never commit them to git (`imports/` is in .gitignore), never paste their contents into AI prompts, delete local copies after import, and do rehearsals only in a separate staging project in the same Mumbai region.

### IMP-06 · Go-live cutover checklist
Rehearse on staging → clinic checks a sample of patients, today's appointments and dues → agree cutover day → stop using BestoSys → final export → import → verify: patient count, appointment count for next 30 days, total dues, inventory value match BestoSys → staff training → go live. Keep BestoSys read-only access until its plan expires, if possible.
