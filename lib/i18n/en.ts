export const en = {
  navigation: {
    dashboard: "Dashboard",
    calendar: "Calendar",
    patients: "Patients",
    reports: "Reports",
    admin: "Admin",
    crm: "CRM",
    help: "Help",
    notifications: "Notifications",
    whatsapp: "WhatsApp",
    settings: "Settings",
  },
  railHelp: "Using the main navigation",
  railHelpText:
    "Use the navy rail to open tools. The current icon is orange. The connection dot is green when the app server responds and red when it cannot be reached. New on WhatsApp means setup needs attention. The User menu becomes available with clinic sign-in. Logout opens a confirmation; No or Escape returns to your work. Yes currently shows that sign-in is not configured. Use Tab and Enter to navigate.",
  navigationLabel: "Main navigation",
  connectionChecking: "Checking server connection",
  connectionOnline: "Server reachable",
  connectionOffline: "Server unavailable",
  newTag: "New",
  messagingSetup: "Messaging setup incomplete",
  userUnavailable: "User menu unavailable until sign-in is configured",
  logoutUnavailable:
    "Sign-in is not configured yet. There is no clinic session to sign out of.",
  logoutQuestion: "Are you sure you want to logout?",
  no: "No",
  yes: "Yes",
  userLabel: "User",
  logoutLabel: "Logout",
  featureUnavailable:
    "This tool is not available yet. Clinic sign-in and access checks must be configured before clinic data can be used.",
  pwaTitle: "App update",
  pwaReady:
    "An Rcrd update is ready. Finish and save your work before applying it.",
  pwaApply: "Apply update",
  pwaActivated:
    "Update requested. Reopen Rcrd after finishing your work to use the latest version.",
  pwaFailed:
    "App updates are unavailable. You can keep using Rcrd in this browser. Reopen it when connected to retry.",
  shortcutTitle: "How to create an Rcrd shortcut",
  shortcutIntro:
    "Install Rcrd from Chrome or Edge on Windows or Mac. Open the installed app from your desktop, Start menu or Applications folder to work in its own window without a browser bar.",
  shortcutChrome: "Chrome",
  shortcutEdge: "Edge",
  shortcutChromeSteps:
    "Open Rcrd in Chrome. Open the three-dot browser menu, choose Cast, save and share, then Install page as app. Confirm Install. You may also see an install icon in the address bar.",
  shortcutEdgeSteps:
    "Open Rcrd in Edge. Open the three-dot browser menu, choose Apps, then Install this site as an app. Confirm Install. You may also see an install icon in the address bar.",
  shortcutMissingTitle: "If installation is unavailable",
  shortcutMissing:
    "Browser labels can vary. Use an up-to-date Chrome or Edge window and an HTTPS address (localhost works for development). If Rcrd is already installed, open its existing shortcut. If your clinic manages browser installation, ask your administrator to enable it. You can continue using Rcrd in a browser.",
  shortcutWindow:
    "Use your operating system’s minimise, restore and close controls. Save your work before closing the app. Installing Rcrd does not store patient records for offline use.",
  installHelp: "Create an Rcrd shortcut",
  installInstructions:
    "In Chrome, open the browser menu and choose Cast, save and share, then Install page as app. In Edge, open the browser menu, choose Apps, then Install this site as an app. Confirm Install to create a shortcut. If Rcrd is already installed, use its existing shortcut. Installation needs HTTPS or localhost.",
  installUpdateHelp:
    "When an update is ready, save your work and choose Apply update. Reopen Rcrd afterwards. Updates never reload your work automatically. An internet connection is required to use clinic tools.",
  appName: "Rcrd",
  description: "Dental practice management for Indian clinics.",
  setupTitle: "Your clinic workspace starts here",
  setupDescription:
    "Rcrd is being set up. Clinic sign-in and practice tools will appear here as they become available.",
  help: "Need Help?",
  helpTitle: "Workspace setup",
  helpText:
    "This workspace is under construction. Patient records and clinic sign-in are not available yet.",
  home: "Back to workspace",
  skip: "Skip to content",
} as const;
