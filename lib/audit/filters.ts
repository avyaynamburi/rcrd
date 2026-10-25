import { z } from "zod";
const optionalText = z.string().trim().max(100).optional();
export const auditFilters = z
  .object({
    from: z.iso.date().optional(),
    to: z.iso.date().optional(),
    user: z.uuid().optional(),
    center: z.uuid().optional(),
    area: optionalText,
    action: optionalText,
    page: z.coerce.number().int().min(1).max(100000).default(1),
  })
  .refine((v) => !v.from || !v.to || v.from <= v.to);
export function filterInput(
  params: Record<string, string | string[] | undefined>,
) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
  );
}
export function indiaMidnight(date: string) {
  return `${date}T00:00:00+05:30`;
}
export function nextDay(date: string) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + 86400000)
    .toISOString()
    .slice(0, 10);
}
