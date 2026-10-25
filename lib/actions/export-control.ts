"use server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions/require-permission";
import { saveExportSchema } from "@/lib/permissions/export-control";
import { en } from "@/lib/i18n/en";
export async function saveExportControl(input: unknown) {
  const parsed = saveExportSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, message: en.exportControl.failed };
  try {
    const account = await requirePermission("accounts", "manage_logins");
    const { error } = await account.client.rpc("set_export_disabled", {
      target_membership_id: parsed.data.membershipId,
      disabled: parsed.data.disabled,
    });
    if (error) throw error;
    revalidatePath("/", "layout");
    return { success: true, message: en.exportControl.saved };
  } catch {
    return { success: false, message: en.exportControl.failed };
  }
}
