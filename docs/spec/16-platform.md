# 16 · Rcrd platform (the company's own console)

Source: description Part 8.1 Centers (Plan, Plan Expiry, SMS Balance — e.g. "Platinum" plan, "Free Trial"), Part 9.1 (NABH "module is expired" box), Part 8.3 (PROWA "contact your Growth Advisor"), Part 10.2 (Support Tickets), Part 10.3 (Application Update, Recent Features), Part 10.4 (WhatsApp expiry), Part 8.5 (Insurance Master is read-only). Rcrd is sold to other clinics after DENTALPROFILES, so the platform side exists from the start.

### PLAT-01 · Platform console
Separate area (`/platform`) only for Platform Admin users (ACC-04). Lists organisations and their centers, owners, plan, expiry, modules, credit balances, usage, open tickets. Platform admins never see patient data by default (ACC-15).

### PLAT-02 · Plans and subscriptions
Plans per center (e.g. Free Trial, Basic, Platinum — names and limits configurable): price, billing period, start and expiry dates, included users/centers/credits. Expiry warnings to owners 30/7/1 days before; after expiry a grace period, then read-only mode (data always viewable/exportable — never hold clinic data hostage). Rcrd invoices clinics for subscriptions (later: online payment).

### PLAT-03 · Modules (licensed add-ons)
Per-center switches with expiry: WhatsApp, NABH, AI Assistant, Patient Portal & Online Booking, PROWA-equivalent growth module, Zoho Books sync, Payment Gateway. Disabled/expired modules show the standard box ("Your [module] module is expired. Please renew" — Later / Renew Now, ADM-04) and hide their automatic actions. "Renew Now"/"Order Now" create a request in the console.

### PLAT-04 · Requests and support
Inbox for support tickets (HELP-03), WABA onboarding requests (WA-01), module renewals/orders, plan changes and credit top-ups; assign, reply, change status; replies appear in the clinic's Support Tickets.

### PLAT-05 · Releases and announcements
Write release notes → shown in every clinic's Notifications → Recent Features (NOTIF-01); flag "update available" so Application Update prompts a reload.

### PLAT-06 · Platform masters
Shared read-only lists for all clinics: Insurance Master (SET-37), default seed sets (treatments, drugs, templates, chart of accounts) applied to new clinics, help articles.

### PLAT-07 · Clinic onboarding
Create organisation → first center → invite owner by email → owner completes a setup checklist (clinic details, centers, doctors/staff, working hours, treatments and prices, payment modes, templates) shown on their Dashboard until done [DESIGN]. Option to start from the import wizard (spec 15).

### PLAT-08 · Support access (break-glass)
Clinic owner grants Rcrd support temporary access (e.g. 2 hours, read-only or read-write) from Settings; every action during it is logged in the clinic's Access Audit; access ends automatically.

### PLAT-09 · Usage metering
Per org/center: active users, patients, appointments, messages by channel, AI usage (AI-11), storage used. Feeds plan limits and Rcrd's own costs.
