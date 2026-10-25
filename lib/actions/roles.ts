"use server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions/require-permission";
import { memberRoleSchema } from "@/lib/permissions/roles";
import { en } from "@/lib/i18n/en";

export async function setMemberRole(input: unknown) {
  const parsed = memberRoleSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: en.roles.failed };
  try {
    const account = await requirePermission("accounts", "manage_logins");
    const { error } = await account.client.rpc("set_member_role", {
      target_membership_id: parsed.data.membershipId,
      new_role: parsed.data.role,
      new_tags: parsed.data.tags,
    });
    if (error) return { success: false, message: en.roles.failed };
    revalidatePath("/account/team");
    return { success: true, message: en.roles.saved };
  } catch {
    return { success: false, message: en.roles.failed };
  }
}
