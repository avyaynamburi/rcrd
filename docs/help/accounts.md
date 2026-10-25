# Your clinic account

Use your own account. Sign in at /login with your email or mobile number and password. Indian ten-digit mobile numbers are accepted; international numbers need a + country prefix. Your clinic owner must provision your account and enable login. There is no public registration.

Choose Forgot password? and enter your email. If it is registered, a recovery email arrives. Open its link, enter a new password of 12–128 characters twice, and save. Links expire and work once. Request another if a link is invalid. Never forward recovery links. A disabled account cannot use a recovery link to enter the clinic app.

Use Change password in the User menu to update your own password. Successful changes revoke other refresh sessions; already issued access tokens can remain valid until expiry. Account access and active membership are rechecked on each protected app request, so disabling login blocks the app immediately.

Owners open Account access from the User menu. Enable Login controls entry to the clinic app; disabling it keeps the person in clinic lists. Enable Mobile Access refuses phone and tablet sign-in on a best-effort basis. Desktop-mode browsers can evade device detection. You cannot change your own access here. Save access explicitly; failures keep your choices on the screen.

Set New Password sends a recovery link to the account email so the person chooses their own password. Owners do not receive or view the password. Accounts used with mobile login also need a verified email for email recovery. Account provisioning and verification must be performed by a trusted administrator until the team creation screen is available.

When sign-in is not configured, forms are disabled and clinic screens remain a data-free construction preview. Contact the owner if configuration is unavailable. During a connection outage, wait for the offline banner to clear and retry; forms keep their input in the current tab. Passwords are never stored in browser storage.

Owners can set a person's base role and tick extra tags on the Team screen. Owner and Owner and Doctor have owner access; extra tags identify people for matching lists as those modules become available. Tags do not grant owner access. Save role applies the role and tags together and records an access audit entry. Another owner must change your own role. Platform Admin is reserved for Rcrd staff in the separate company console.

New accounts start with defaults for their base role. Owners and owners who also treat patients have all clinic permissions. Doctors start with their own and shared patients, clinical records and files, their own appointments, and bills for their own treatments. Front desk staff start with registration, contact details, appointments, check-in/out, billing, payment collection and messages; clinical notes and prescriptions stay unavailable. Accountants start with billing, receipts, refunds, credit notes, accounting, inventory, lab bills and financial reports; clinical notes stay unavailable.

Extra role tags do not grant permissions automatically. Non-owner defaults do not allow deletion. Open Access under a non-owner on the Team screen to set Allow Entry, Allow Edit, Allow Delete and View Report for each area. Choose Any Day, Same Day (center timezone) or No Access. Under Edit and Delete, untick “Edit Data Entered by others” to restrict changes to their creator. Save access applies the grid atomically and records an audit entry. Owner access is protected. Overrides are retained when changing roles; review them after a role change. Enforcement of these overrides in future modules is tracked under ACC-11; current pages remain closed until their server permission checks and row-level security are implemented.

To reuse permissions, open a person’s Access grid and choose another person in Select Copy Access from on the right. This copies their full saved grid (or role defaults) into the draft, including day and creator restrictions. Review and edit it, then Save access to apply it. Copying alone does not change access. Reloading discards the draft. Roles, tags, login settings and center access are not copied. Owner grids remain protected.

Under Centers, select the branches a person can work in and choose Save centers. Clearing every branch removes all branch access. Changes are saved together and audited; removing a branch preserves its records and takes effect on the next database request. Another owner must change your own branch access. Only active branches from your clinic appear. Failed saves keep the draft for retry. Patients, appointments and bills remain restricted to authorized branches; cross-branch patient search is disabled pending clinic confirmation.

### Appointment visibility

An owner can choose **Allowed to see appointments → All / Own only** for each non-owner team member, then select **Save appointment visibility**. Changes are recorded in the access audit. Own only means appointments assigned to that person's individual doctor identity, including Calendar, Today and status counts. It does not mean appointments they created. Unassigned appointments are hidden under Own only. Both options still require access to the appointment's clinic and branch.

The setting is available now; live Calendar, Today and status-count enforcement is connected when appointment storage is built in P4. Preview status circles continue to show unavailable counts. Owner settings are protected; offline changes cannot be submitted. On a save error, retry when connected.

Owners can disable Excel, PDF and print exports for an individual in Team. Save the export restriction separately from other access changes. Owner accounts are protected. This restriction does not grant access to records. Report and list export controls will use it when those screens are built.

Open Record details (the three-dot control) on a Team row to see its yellow Created and Updated note. Dates include the time in India time. The user is shown by their account email; older or system-created records without an attributable clinic user show “User unavailable”. These notes describe the account row, not a detailed change history; use Access Audit for individual events. Saving changes refreshes the note.
