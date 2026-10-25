"use server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions/require-permission";
import { personDeletionSchema } from "@/lib/permissions/deleted-people";
import { en } from "@/lib/i18n/en";

export async function setPersonDeleted(input: unknown) {
  const parsed = personDeletionSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: en.people.failed };
  try {
    const account = await requirePermission("accounts", "manage_logins");
    const { error } = await account.client.rpc("set_person_deleted", {
      target_membership_id: parsed.data.membershipId,
      deleted: parsed.data.deleted,
    });
    if (error) throw error;
    revalidatePath("/", "layout");
    return {
      success: true,
      message: parsed.data.deleted ? en.people.deleted : en.people.restored,
    };
  } catch {
    return { success: false, message: en.people.failed };
  }
}
