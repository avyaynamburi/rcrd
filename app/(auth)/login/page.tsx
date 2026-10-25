import { AuthForm } from "@/components/auth/auth-form";
import { authConfigured } from "@/lib/supabase/server";
export default function Login() {
  return <AuthForm mode="login" configured={authConfigured()} />;
}
