import { headers } from "next/headers";
import { createAuthClient } from "@/lib/supabase/server";
import { isMobileDevice } from "./validation";

export async function getAccount(
  clientOverride?: Awaited<ReturnType<typeof createAuthClient>>,
) {
  try {
    const client = clientOverride ?? (await createAuthClient());
    if (!client) return null;
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error || !user) {
      if (process.env.RCRD_LIVE_AUTH === "1")
        console.warn("Synthetic account: identity denied", error?.code);
      return null;
    }
    const { data: member, error: memberError } = await client
      .from("memberships")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (!member?.login_enabled || member.deleted_at) {
      if (process.env.RCRD_LIVE_AUTH === "1")
        console.warn("Synthetic account: membership denied", memberError?.code);
      return null;
    }
    if (!("mobile_access_enabled" in member) || !("is_owner" in member))
      return null;
    if (
      !member.mobile_access_enabled &&
      isMobileDevice((await headers()).get("user-agent") ?? "")
    )
      return null;
    const { data: org, error: orgError } = await client
      .from("organisations")
      .select("name")
      .eq("org_id", member.org_id)
      .single();
    if (!org) {
      if (process.env.RCRD_LIVE_AUTH === "1")
        console.warn("Synthetic account: organisation denied", orgError?.code);
      return null;
    }
    return { client, user, member, org };
  } catch {
    return null;
  }
}
