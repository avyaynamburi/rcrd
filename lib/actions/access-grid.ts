"use server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions/require-permission";
import { saveAccessSchema } from "@/lib/permissions/access-grid";
import { en } from "@/lib/i18n/en";
export async function saveAccessGrid(input: unknown) {
  const parsed = saveAccessSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: en.accessGrid.failed };
  try {
    const account = await requirePermission("accounts", "manage_logins");
    const { error } = await account.client.rpc("set_member_access", {
      target_membership_id: parsed.data.membershipId,
      new_grid: parsed.data.grid,
    });
    if (error) throw error;
    revalidatePath("/account/team");
    return { success: true, message: en.accessGrid.saved };
  } catch {
    return { success: false, message: en.accessGrid.failed };
  }
}
