import { z } from "zod";
export const centerAccessSchema = z.object({
  centers: z.array(z.object({ id: z.uuid(), name: z.string() })),
  grants: z.array(z.object({ membershipId: z.uuid(), centerId: z.uuid() })),
});
export const saveCentersSchema = z.object({
  membershipId: z.uuid(),
  centerIds: z
    .array(z.uuid())
    .max(1000)
    .refine((ids) => new Set(ids).size === ids.length),
});
