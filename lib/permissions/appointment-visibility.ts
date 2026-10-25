import { z } from "zod";
export const appointmentVisibilitySchema = z.enum(["all", "own"]);
export const saveVisibilitySchema = z
  .object({
    membershipId: z.uuid(),
    visibility: appointmentVisibilitySchema,
  })
  .strict();
export const memberVisibilitySchema = z.array(
  z.object({
    id: z.uuid(),
    appointment_visibility: appointmentVisibilitySchema,
  }),
);
