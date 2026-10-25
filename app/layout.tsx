import { ToastProvider } from "@/components/blocks/toast-provider";
import { HelpProvider } from "@/components/blocks/help-drawer";
import { loadHelpArticles } from "@/lib/help";
import { AssistantLauncher } from "@/components/shell/assistant-launcher";
import { IconRail } from "@/components/shell/icon-rail";
import { navigationItems } from "@/lib/shell-navigation";
import { version } from "@/package.json";
import { StatusCircles } from "@/components/shell/status-circles";
import { ClinicClock } from "@/components/shell/clinic-clock";
import { AppTitle } from "@/components/shell/app-title";
import { UpdateNotice } from "@/components/pwa/update-notice";
import type { Metadata, Viewport } from "next";
import { en } from "@/lib/i18n/en";
import "./globals.css";
export const metadata: Metadata = {
  title: en.appName,
  description: en.description,
};
export const viewport: Viewport = { themeColor: "#1E2A4A" };
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:p-3 focus:bg-white"
          href="#main"
        >
          {en.skip}
        </a>
        {/* Public construction preview only; no authenticated clinic data is exposed. */}
        <ToastProvider>
          <HelpProvider articles={await loadHelpArticles()}>
            <IconRail
              allowed={navigationItems.map((item) => item.id)}
              version={version}
              messagingNeedsSetup
            />
            <div className="app-workspace min-w-0">
              <AppTitle
                controls={
                  <>
                    <StatusCircles />
                    <ClinicClock />
                  </>
                }
              />
              <UpdateNotice />
              {children}
              <AssistantLauncher />
            </div>
          </HelpProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
