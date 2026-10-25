import { authConfigured } from "@/lib/supabase/server";
import { getAccount } from "@/lib/auth/session";
import { redirect } from "next/navigation";
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Without configuration only the existing data-free construction preview exists.
  if (authConfigured() && !(await getAccount())) redirect("/login");
  return children;
}
