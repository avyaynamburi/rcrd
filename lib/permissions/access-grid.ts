import { z } from "zod";
import {
  getDefaultPermissions,
  permissionAreas,
  type PermissionArea,
} from "./presets";

export const gridActions = ["entry", "edit", "delete", "report"] as const;
export const gridAreas = permissionAreas.slice(0, 24);
export const cellSchema = z
  .object({ day: z.enum(["any", "same", "none"]), others: z.boolean() })
  .strict();
export const accessGridSchema = z
  .record(
    z.enum(permissionAreas),
    z
      .object({
        entry: cellSchema,
        edit: cellSchema,
        delete: cellSchema,
        report: cellSchema,
      })
      .strict(),
  )
  .refine((grid) => Object.keys(grid).length === permissionAreas.length);
export type AccessGrid = z.infer<typeof accessGridSchema>;
export const saveAccessSchema = z.object({
  membershipId: z.uuid(),
  grid: accessGridSchema,
});
export function defaultGrid(role: unknown): AccessGrid {
  const preset = getDefaultPermissions(role);
  return Object.fromEntries(
    permissionAreas.map((area) => [
      area,
      Object.fromEntries(
        gridActions.map((action) => [
          action,
          { day: preset.areas[area][action] ? "any" : "none", others: true },
        ]),
      ),
    ]),
  ) as AccessGrid;
}
export function allowsCell(
  grid: AccessGrid,
  area: PermissionArea,
  action: (typeof gridActions)[number],
  record: { date: string; createdBy: string },
  actor: string,
  now: Date,
  timezone: string,
): boolean {
  const cell = grid[area][action];
  if (
    cell.day === "none" ||
    ((action === "edit" || action === "delete") &&
      !cell.others &&
      record.createdBy !== actor)
  )
    return false;
  if (cell.day === "any") return true;
  const date = new Date(record.date);
  if (!Number.isFinite(date.getTime())) return false;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date) === formatter.format(now);
}
