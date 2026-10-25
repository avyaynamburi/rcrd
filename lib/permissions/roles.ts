import { z } from "zod";

// Platform Admin belongs to the separate Rcrd console, never clinic membership.
export const clinicRoles = [
  "owner",
  "owner_doctor",
  "doctor",
  "staff",
  "accountant",
] as const;
export const roleTags = [
  "consultant",
  "orthodontist",
  "tele_caller",
  "marketing",
  "accountant",
] as const;
export const roleSchema = z.enum(clinicRoles);
export const roleTagsSchema = z
  .array(z.enum(roleTags))
  .max(roleTags.length)
  .refine((tags) => new Set(tags).size === tags.length);
export const memberRoleSchema = z
  .object({ membershipId: z.uuid(), role: roleSchema, tags: roleTagsSchema })
  .strict();
export function isOwnerRole(role: z.infer<typeof roleSchema>) {
  return role === "owner" || role === "owner_doctor";
}
export function hasRoleTag(
  tags: readonly string[],
  tag: (typeof roleTags)[number],
) {
  return tags.includes(tag);
}
