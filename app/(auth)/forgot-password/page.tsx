import { AuthForm } from "@/components/auth/auth-form";
import { authConfigured } from "@/lib/supabase/server";
export default async function Recovery({
  searchParams,
}: {
  searchParams: Promise<{ invalid?: string }>;
}) {
  return (
    <AuthForm
      mode="recovery"
      configured={authConfigured() && Boolean(process.env.AUTH_SITE_URL)}
      invalidLink={(await searchParams).invalid === "1"}
    />
  );
}
