import { z } from "zod";
export const saveExportSchema = z
  .object({ membershipId: z.uuid(), disabled: z.boolean() })
  .strict();
export const memberExportSchema = z.array(
  z.object({ id: z.uuid(), export_disabled: z.boolean() }),
);
