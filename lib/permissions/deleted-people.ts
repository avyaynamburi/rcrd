import { z } from "zod";
import { roleSchema } from "./roles";

export const personDeletionSchema = z
  .object({
    membershipId: z.uuid(),
    deleted: z.boolean(),
  })
  .strict();
export const deletedPeopleSchema = z.array(
  z.object({
    id: z.uuid(),
    email: z.string().nullable(),
    base_role: roleSchema,
    deleted_at: z.iso.datetime({ offset: true }),
  }),
);
export type DeletedPerson = z.infer<typeof deletedPeopleSchema>[number];
export function isDoctorOrOwner(role: z.infer<typeof roleSchema>) {
  return role === "owner" || role === "owner_doctor" || role === "doctor";
}
