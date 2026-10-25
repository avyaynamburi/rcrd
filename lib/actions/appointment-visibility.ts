"use server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions/require-permission";
import { saveVisibilitySchema } from "@/lib/permissions/appointment-visibility";
import { en } from "@/lib/i18n/en";
export async function saveAppointmentVisibility(input: unknown) {
  const parsed = saveVisibilitySchema.safeParse(input);
  if (!parsed.success)
    return { success: false, message: en.appointmentVisibility.failed };
  try {
    const account = await requirePermission("accounts", "manage_logins");
    const { error } = await account.client.rpc("set_appointment_visibility", {
      target_membership_id: parsed.data.membershipId,
      visibility: parsed.data.visibility,
    });
    if (error) throw error;
    revalidatePath("/", "layout");
    return { success: true, message: en.appointmentVisibility.saved };
  } catch {
    return { success: false, message: en.appointmentVisibility.failed };
  }
}
