import { AuthForm } from "@/components/auth/auth-form";
import { authConfigured } from "@/lib/supabase/server";
import { getAccount } from "@/lib/auth/session";
import { redirect } from "next/navigation";
export default async function Password() {
  if (authConfigured() && !(await getAccount())) redirect("/login");
  return <AuthForm mode="password" configured={authConfigured()} />;
}
