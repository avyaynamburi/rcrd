# 07 · Shared building blocks

Source: description Part 1 Layout B, Part 7. Build these once as components; every page uses them. About 40 pages are "standard list" pages.

### UI-01 · Standard list page
1. Navy page title top-left of the work area (e.g. "Center List", "Drug Master List").
2. Filter row under it: small grey labels above dropdowns (usually "Center" and "Status = Active"), sometimes a Search box, then a navy "View" button and a grey "Reset" button.
3. Top-right row: navy "+ New" button, green Excel icon, red PDF icon, blue printer icon.
4. Table: thin grey border; small grey capital-letter column headings, some with a sort arrow and a funnel filter icon; white rows about 32 px tall; "Yes" in green and "No" in red.
5. Every row starts with a vertical three-dot menu: "Edit" (pencil) and "Delete" (bin), plus a small yellow note "Created: [user] on [date]" and "Updated: [user] on [date]".
6. Footer under the table: "Count: N".
7. Pages with soft-deleted records show a second table underneath (e.g. "Deleted Staff List") with Restore.
The component is driven by a config (columns, filters, form, permissions area) so new list pages are mostly configuration.

### UI-02 · Empty pages
Large light-grey text in the middle: "Looks like there's nothing to show here".

### UI-03 · Inputs
- Outlined boxes with a tiny grey label sitting in the top border.
- Red * marks required fields.
- Dropdowns have a small down arrow on the right; long lists are searchable (UI-10).
- Date boxes have a calendar icon on the left and a red x on the right to clear. Time boxes have a clock icon.
- Validation messages appear under the field in plain words.

### UI-04 · Pop-up boxes
White with rounded corners. Rcrd logo and the title top-left, red x top-right, tabs under the title when needed, and at the bottom "Need Help?" (orange, left) with CANCEL (outlined) and SAVE (navy) on the right. The page behind darkens.

### UI-05 · Full-page forms
End with RESET and SAVE centred under the boxes (or GIVE, or MERGE, as the page needs).

### UI-06 · Small warning boxes
Title "Rcrd", one line of text, two buttons (used for logout, "Doctor is not available on selected date", "module expired", delete confirmations).

### UI-07 · Excel / PDF / Print
Every list and report: Excel (.xlsx) and PDF of exactly what's on screen (current filters and sort), and Print (opens the PDF in the browser print dialog). Hidden and blocked when the user has export disabled (ACC-10). Every export is logged (ACC-12).

### UI-08 · Table behaviour
Sortable columns, per-column funnel filters, sticky header, keyboard navigation, column resize, and money right-aligned in Indian format.

### UI-09 · Soft delete and restore
Deleting moves a record to the deleted list (UI-01 item 7) instead of erasing it; owners can restore. Hard deletes only via Patient Merge (SET-54) or the DPDP erasure flow.

### UI-10 · Searchable dropdowns
Any dropdown with more than ~10 options has a search box at the top (doctors, patients, treatments, drugs, inventory items, accounts, vendors).

### UI-11 · Keyboard and speed
Enter submits forms, Esc closes pop-ups, logical tab order, visible focus outline, "/" focuses the patient search. Pages should load in under 1.5 s on a normal clinic connection.

### UI-12 · Colours
Use only the design tokens in AGENTS.md §8. Meanings: navy = rail, headings, main buttons; accent = active menu item, "Need Help?"; green = Yes/Out/Connected; red = No/In/money owed; peach = today on the calendar; appointment colours from settings.

### UI-13 · Formats
Dates "3 Aug, 2026"; times "10:07 pm"; money "INR 6,000.00" / "Due. 6,000.00" with Indian digit grouping (1,00,000.00); phone with country code; all times in the clinic's timezone.

### UI-14 · Loading and errors
Skeleton loaders for lists; buttons show a spinner and disable while saving (no double submit); errors in a red toast with what to do next.
