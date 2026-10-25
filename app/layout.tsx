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
export default function RootLayout({
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
        <AppTitle />
        <UpdateNotice />
        {children}
      </body>
    </html>
  );
}
