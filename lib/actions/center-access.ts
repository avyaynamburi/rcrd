"use server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions/require-permission";
import { saveCentersSchema } from "@/lib/permissions/center-access";
import { en } from "@/lib/i18n/en";
export async function saveCenterAccess(input: unknown) {
  const parsed = saveCentersSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, message: en.centerAccess.failed };
  try {
    const account = await requirePermission("accounts", "manage_logins");
    const { error } = await account.client.rpc("set_member_centers", {
      target_membership_id: parsed.data.membershipId,
      center_ids: parsed.data.centerIds,
    });
    if (error) throw error;
    revalidatePath("/", "layout");
    return { success: true, message: en.centerAccess.saved };
  } catch {
    return { success: false, message: en.centerAccess.failed };
  }
}
