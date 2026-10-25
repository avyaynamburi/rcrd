"use server";
import { z } from "zod";
import { requirePermission } from "@/lib/permissions/require-permission";
const exportSchema = z.object({
  format: z.enum(["xlsx", "pdf"]),
  page: z.number().int().min(1).max(100000),
});
export async function recordAuditExport(input: unknown) {
  const parsed = exportSchema.parse(input);
  const account = await requirePermission("accounts", "manage_logins");
  const result = await account.client.rpc("record_audit_export", {
    export_format: parsed.format,
    page_number: parsed.page,
  });
  if (result.error) throw new Error("Audit failed");
}
