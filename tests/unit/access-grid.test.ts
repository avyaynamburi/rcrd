import { expect, it } from "vitest";
import {
  accessGridSchema,
  allowsCell,
  defaultGrid,
} from "@/lib/permissions/access-grid";
it("requires the complete grid and rejects unknown cells", () => {
  expect(accessGridSchema.safeParse(defaultGrid("staff")).success).toBe(true);
  expect(accessGridSchema.safeParse({}).success).toBe(false);
  const grid = defaultGrid("staff");
  expect(
    accessGridSchema.safeParse({ ...grid, unexpected: grid.patient }).success,
  ).toBe(false);
});
it("checks Same Day in the clinic timezone across UTC midnight", () => {
  const grid = defaultGrid("staff");
  grid.billing.edit = { day: "same", others: true };
  const now = new Date("2026-10-25T20:00:00Z");
  expect(
    allowsCell(
      grid,
      "billing",
      "edit",
      { date: "2026-10-26T01:00:00Z", createdBy: "other" },
      "me",
      now,
      "Asia/Kolkata",
    ),
  ).toBe(true);
  expect(
    allowsCell(
      grid,
      "billing",
      "edit",
      { date: "2026-10-25T17:00:00Z", createdBy: "me" },
      "me",
      now,
      "Asia/Kolkata",
    ),
  ).toBe(false);
});
it("denies other creators and No Access even for current records", () => {
  const grid = defaultGrid("staff");
  grid.patient.edit = { day: "any", others: false };
  const record = { date: new Date().toISOString(), createdBy: "other" };
  expect(
    allowsCell(
      grid,
      "patient",
      "edit",
      record,
      "me",
      new Date(),
      "Asia/Kolkata",
    ),
  ).toBe(false);
  expect(
    allowsCell(
      grid,
      "patient",
      "edit",
      record,
      "other",
      new Date(),
      "Asia/Kolkata",
    ),
  ).toBe(true);
  expect(
    allowsCell(
      grid,
      "patient",
      "delete",
      record,
      "other",
      new Date(),
      "Asia/Kolkata",
    ),
  ).toBe(false);
});
