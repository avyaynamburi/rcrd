"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/permissions/require-permission";
import { getAccount } from "@/lib/auth/session";
import {
  changePasswordSchema,
  loginSchema,
  recoverySchema,
  loginIdentity,
  loginAccessSchema,
} from "@/lib/auth/validation";
import { en } from "@/lib/i18n/en";

export type AuthResult = { message: string; success?: boolean };
const unavailable = (): AuthResult => ({ message: en.auth.unavailable });
const failed = (): AuthResult => ({ message: en.auth.failed });

export async function signIn(input: unknown): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return failed();
  const identity = loginIdentity(parsed.data.identifier);
  if (!identity) return failed();
  try {
    const client = await createAuthClient();
    if (!client) return unavailable();
    const { error } = await client.auth.signInWithPassword({
      ...identity,
      password: parsed.data.password,
    });
    if (error) {
      if (process.env.RCRD_LIVE_AUTH === "1")
        console.warn("Synthetic login denied", error.code);
      return failed();
    }
    if (!(await getAccount(client))) {
      await client.auth.signOut({ scope: "local" });
      return failed();
    }
  } catch {
    return unavailable();
  }
  redirect("/calendar");
}

export async function requestPasswordReset(
  input: unknown,
): Promise<AuthResult> {
  const parsed = recoverySchema.safeParse(input);
  if (!parsed.success) return { message: en.auth.invalidEmail };
  try {
    const client = await createAuthClient();
    const origin = process.env.AUTH_SITE_URL;
    if (!client || !origin) return unavailable();
    const { error } = await client.auth.resetPasswordForEmail(
      parsed.data.email,
      { redirectTo: `${origin}/auth/confirm` },
    );
    // Use the same response for unknown, disabled and existing accounts, including rate limits.
    if (error) return { message: en.auth.resetSent, success: true };
    return { message: en.auth.resetSent, success: true };
  } catch {
    return unavailable();
  }
}

export async function changePassword(input: unknown): Promise<AuthResult> {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return { message: en.auth.passwordRule };
  try {
    const account = await requirePermission("accounts", "change_password");
    const { error } = await account.client.auth.updateUser({
      password: parsed.data.password,
    });
    if (error) return { message: en.auth.passwordFailed };
    // Supabase Auth owns password changes and records its own auth audit event.
    // Revoke other refresh sessions after a successful password change.
    const { error: revokeError } = await account.client.auth.signOut({
      scope: "others",
    });
    if (revokeError) return { message: en.auth.passwordRevokeFailed };
    return { message: en.auth.passwordChanged, success: true };
  } catch {
    return unavailable();
  }
}

export async function signOut(): Promise<AuthResult> {
  try {
    const client = await createAuthClient();
    if (!client) return { message: en.logoutUnavailable };
    const { error } = await client.auth.signOut({ scope: "global" });
    if (error) return unavailable();
  } catch {
    return unavailable();
  }
  redirect("/login");
}

export async function setLoginAccess(input: unknown): Promise<AuthResult> {
  const parsed = loginAccessSchema.safeParse(input);
  if (!parsed.success) return failed();
  try {
    const account = await requirePermission("accounts", "manage_logins");
    const { error } = await account.client.rpc("set_login_access", {
      target_membership_id: parsed.data.membershipId,
      enabled: parsed.data.enabled,
      mobile_enabled: parsed.data.mobileEnabled,
    });
    if (error) return failed();
    revalidatePath("/account/team");
    return { message: en.auth.accessSaved, success: true };
  } catch {
    return unavailable();
  }
}
