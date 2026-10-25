# 01 · App shell and navigation

Source: description Parts 1, 2, 7.4. Layout sizes are for a 1920×1080 window; everything must also work at 1366×768 (common clinic monitors) by scrolling inside panels, never by hiding features.

Legend used in all spec files:
- **[DESIGN]** = not shown in the recordings. We design it to match the rest; confirm with the clinic before calling it done.
- **[CONFIRM]** = shown, but its exact meaning is unclear. Build the best guess, flag it for the clinic.

### SHELL-01 · App window and installable app
- Installable web app (PWA): manifest, icons, `display: standalone`, so staff open it from a desktop icon in its own window with no browser bar. Works in Chrome and Edge on Windows and Mac.
- App title area shows the Rcrd logo and the word "Rcrd" (replaces BestoSys's purple "b" logo). The OS draws minimise / restore / close.
- Help article "How to create an Rcrd shortcut" explains installing it (HELP-02).

### SHELL-02 · Icon rail
- Solid navy strip on the far left, about 70 px wide, full height.
- Online dot in its top-left corner: green when the app can reach the server, grey/red when offline (see SHELL-14).
- White icons, each with a small white label underneath. The icon for the current screen turns the accent colour.
- Two groups with an empty gap between them:
  - Top (7): Dashboard (grid of four squares), Calendar (calendar page), Patients (person), Reports (lined rows), Admin (ID card), CRM (handshake), Help (light bulb).
  - Bottom (5): Notifications (bell with red unread-count badge, e.g. "30"), WhatsApp (WhatsApp-style chat icon with a small red "New" tag while there is something new or setup is incomplete — do not use WhatsApp's trademarked logo), Settings (gear), User avatar (white circle with the user's initials), Logout (arrow leaving a box).
- App version text at the very bottom (from package.json, e.g. "v0.1.0").
- Icons the user has no permission for are hidden.

### SHELL-03 · Logout confirmation
Small warning box: title "Rcrd", text "Are you sure you want to logout?", buttons No and Yes.

### SHELL-04 · User avatar menu
- Circle with the logged-in user's initials (e.g. "FD" for a front desk login, "RT" for an owner login).
- Click opens a small menu [DESIGN]: name, role, current center, change password, switch center (only centers the user may access).

### SHELL-05 · Top bar
- White strip about 60 px tall, right of the rail.
- Left (about x = 90): the organisation's display name in navy capital letters (e.g. DENTALPROFILES). On forms and on a patient profile a left-pointing back arrow sits just before it.
- Right side changes per screen: on the Calendar it holds the calendar controls (CAL-02…CAL-07); on almost every other screen it holds the status circles (SHELL-06) and the date and time (SHELL-07).

### SHELL-06 · Today's status circles
- Seven small coloured circles with numbers: navy = total today, grey = scheduled, red = checked in, orange = engaged, green = checked out, dark grey = missed, light grey = cancelled. [CONFIRM] which status the dark grey circle is in BestoSys; use "missed".
- Counts today's appointments for the centers the user can see, updating live (realtime subscription).
- Tooltip on each circle names the status. Clicking a circle opens the Calendar Today panel filtered to that status [DESIGN].

### SHELL-07 · Date and time
Shows clinic-local date and time, e.g. "3 Aug, 2026 10:07 pm", updating every minute. Clinic timezone defaults to Asia/Kolkata.

### SHELL-08 · Work area and second menu
- White work area right of the rail and below the top bar.
- Settings, Admin, CRM and the bell open a white second menu about 290 px wide next to the rail (x ≈ 70–360); the page fills the rest (from x ≈ 370).
- Second menu: bold navy group headings, each with a down arrow (closed) / up arrow (open); open groups list their pages in grey; the current page is in the accent colour. Several groups can be open at once. Remember open groups per user in localStorage (wrapped in try/catch).

### SHELL-09 · AI assistant button
- Round button in the bottom-right corner (about x = 1815, y = 990), light accent colour, on almost every screen.
- A white speech bubble to its left: "I'm Rcrd Assistant — ask me anything", with a small red x to close it (remember dismissal per user).
- Opens the assistant panel (spec 12).

### SHELL-10 · "Need Help?" links
Orange "Need Help?" link, usually bottom-left of forms and pop-ups. Opens the help article for that exact screen in a side drawer (each screen has a help key; articles live in `docs/help/`).

### SHELL-11 · Colour meanings
Navy = rail, headings, main buttons. Accent (orange) = open menu item, "Need Help?". Appointment cards = doctor or treatment-category colour (setting SET-02). Green = Yes, Out, Connected. Red = No, In, amounts owed. Light peach = today's column on the calendar. Exact tokens are in AGENTS.md §8.

### SHELL-12 · Toast messages
Green success toast bottom-right (e.g. "Appointment added successfully!"); red error toast with a plain-language reason. Never fail silently.

### SHELL-13 · Phone and tablet layout [DESIGN]
For users with "Enable Mobile Access" (ACC-03): on narrow screens the rail becomes a bottom bar with the main icons plus "More"; tables become stacked cards; forms become one column.

### SHELL-14 · Offline handling
If the server can't be reached: the online dot changes colour, a banner says changes can't be saved right now, and Save buttons are disabled until the connection returns. Never lose typed data — keep unsaved form contents in memory until saved.

### SHELL-15 · Current center
Each user has a current center (saved per user). It is the default for every Center dropdown and the calendar. Only centers the user may access are offered.
