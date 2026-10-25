# 13 · Billing, messaging and printing engines

Source: description Part 3.4/3.8 (Payment Due, Bill & Collect), Part 6 (Treatment Done columns with GST, Receive / Refund / Send Payment Link), Part 8.1 (Printing Setup, WA/SMS/Emails, Integrations), Part 8.3 (Branding), Part 9.2, Part 10.4. Owner choices: India first, GST invoices, record UPI/cash/card/wallet payments now (gateway later), WhatsApp/SMS fully built but logged until a provider is connected.

## Billing

### BILL-01 · Money handling
Store money as integer paise; never floats. Display "INR 6,000.00" / "Due. 6,000.00" with Indian grouping (1,00,000.00). Round GST per line to paise.

### BILL-02 · Invoices with GST
- Created from Treatment Done, Bill & Collect (CAL-33), memberships, packages.
- Number per center per financial year (e.g. RBI/2026-27/000123), reset each 1 April when SET-01 says so; never reused; cancelled invoices keep their number.
- Lines: treatment, teeth, quantity, rate (from ratecard), discount (line, group SET-43, ratecard, membership), taxable value, GST rate, CGST + SGST (same state) or IGST (patient in another state, only when a patient GSTIN/state requires it), HSN/SAC (when SET-03 says include), total.
- Center's GSTIN, legal name (Billing Name), address on the invoice; doctor name when SET-03 says so; "Show GST column always" setting.
- GST treatment: rates come from the Treatment master (SET-31); most clinical dental services are exempt health care, cosmetic work usually taxable — the clinic's CA confirms the rates; the software never decides tax law.
- "Allow Vouchers From" lock (SET-01): no new/edited vouchers before that date.
- Editing an invoice after payment requires Edit permission (with Same Day rules) — Help FAQ "Unable to edit bill" explains why.

### BILL-03 · Receipts, refunds, credit notes, advances
- Receipt: amount, mode (Cash, Chq/Online, Card, Wallet, Other) + account (SET-14 … SET-19) + reference; applied to invoices oldest first or kept as advance.
- Refund: from the profile's "Refund" link — amount, mode/account, reason, against receipt/advance; prints refund voucher.
- Credit note: ADM-11.
- Patient balance = invoices − receipts + refunds − credit notes ± opening balance. One SQL view feeds every "Payment Due" display (calendar pop-over, profile, patient list, dashboard).

### BILL-04 · Payment Due everywhere
Payment Due shown consistently in CAL-19, PROF-10, PAT-03, DASH-03 and the Today panel, always from BILL-03's view.

### BILL-05 · Auto Billing
When enabled (CAL-33 tick box), today's unbilled Treatment Done items for the patient fill the bill automatically.

### BILL-06 · Send Payment Link
- Now: sends a UPI payment request message — the center's UPI ID (from the Wallet entry marked UPI) as a `upi://pay` link and QR image with amount and invoice number. Staff confirm the payment manually as a receipt (mode Wallet → UPI).
- Later (gateway phase): Razorpay payment links; webhook creates the receipt automatically and the transaction appears in ADM-14.
- Message uses the "Payment link" / "Payment reminder link" notifications (SET-10).

### BILL-07 · Insurance and corporate billing
Patient's insurance (PAT-10) and ratecard (SET-24) on the invoice; split between patient share and insurer/corporate share [DESIGN]; claims tracking: claim number, amount claimed, status (Submitted, Approved, Rejected, Settled), settlement amount; Specialist Fees insurance % for remuneration.

## Messaging

### MSG-01 · Messaging engine and providers
- Channels: WhatsApp, SMS, Email. One `MessageProvider` interface per channel with adapters.
- Default adapter "Log only": stores the message with status "Not sent — no provider connected" so every trigger, template and screen can be built and tested now.
- Planned adapters: WhatsApp Business API via a BSP (e.g. Meta Cloud API, Gupshup, Interakt, MSG91), SMS via an Indian DLT-compliant gateway (e.g. MSG91), email via a transactional email service. Provider is chosen per organisation/center by Rcrd (platform settings), not hard-coded.
- Status tracking: queued → sent → delivered → read / failed (from provider webhooks when available).

### MSG-02 · Automatic triggers and scheduler
- Every patient and doctor notification in SET-10, plus recalls (SET-22), birthdays, anniversaries, membership expiries, and per-category reminder timing (SET-30).
- A scheduler (Supabase scheduled function or cron route, every 5 minutes) finds due messages, renders templates, checks consent and credits, and sends through MSG-01.
- Idempotent: each trigger+record pair sends at most once; editing an appointment cancels its pending reminders and schedules new ones.

### MSG-03 · Consent and quiet rules
Respect "Standard Appointment Reminder", SMS DND, Email DND, WhatsApp DND (PAT-11), inactive/excluded patients, and quiet hours (no promotional messages 9 pm–9 am). Transactional messages (appointment, invoice) vs promotional (festival, offers) are labelled; promotional needs the patient's opt-in [DESIGN].

### MSG-04 · Credits and balances
Per-center SMS and WhatsApp credit balances (shown on Centers, SET-05), deducted per message, alert to owners at the Balance Alert Level (SET-20), transfers between centers (ADM-25), top-ups by Rcrd (PLAT-02). With the Log-only adapter, credits are not deducted.

### MSG-05 · India compliance
- SMS: DLT registration — entity ID, sender ID (header) and each template's DLT template ID stored with the template; only registered templates are sent.
- WhatsApp: business-initiated messages only with Meta-approved templates (SET-47 approval status); free-form replies only within the customer service window.
- Email: SPF/DKIM set up on the sending domain; unsubscribe link on promotional emails.

### MSG-06 · Manual messages
From the profile (SMS/WA +, Email, Letter), the calendar pop-over WhatsApp icon, prescription/invoice "share" icons, and bulk messaging (CRM-08). Composer: pick template or type, tokens auto-filled, preview, send. PDFs go as secure expiring links. Without a provider, the composer offers "Open in WhatsApp" (a `wa.me` link on the staff member's own WhatsApp) as a fallback.

### MSG-07 · Message log
Every message (auto or manual) stored with patient, channel, template, body, status, cost, time; visible on the patient profile [DESIGN: "Messages" list under the identity card actions] and in CRM → Communications (CRM-07).

## Printing

### PRINT-01 · Printable documents
Generated as PDFs server-side using the Printing Setup (SET-03): letterhead template and logos, paper size per document type, margins, font size, footers. Documents: invoice, receipt, refund voucher, credit note, payment-made voucher, prescription (with SET-03 extras), treatment plan, visit case sheet, full case sheet, patient profile, letters/consents (SET-49), lab work slip, NABH registers, every list/report export.

### PRINT-02 · Print flow
Print buttons open the PDF in the browser's print dialog (works the same on Windows and Mac); also Download and WhatsApp/Email share.

## Integrations

### INT-01 · Zoho Books sync (later phase)
Licensed add-on: every invoice, receipt, refund and credit note is pushed to the clinic's Zoho Books (OAuth connection, account mapping screen, retry queue, sync log). "Order Now" on SET-04 requests it from Rcrd; built after the core phases.

### INT-02 · Integration framework
Common pattern for external services (messaging providers, payment gateway, Zoho, AI providers): credentials stored encrypted server-side, connection status, test button, webhook endpoint with signature check, sync/error log.
