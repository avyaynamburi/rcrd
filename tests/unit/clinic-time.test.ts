import { expect, it } from "vitest";
import { formatClinicTime } from "@/lib/clinic-time";

it("uses clinic time rather than the browser timezone across midnight", () => {
  const time = new Date("2026-08-03T19:30:00Z");
  expect(formatClinicTime(time)).toContain("4 Aug 2026");
  expect(formatClinicTime(time)).toContain("1:00 am");
  expect(formatClinicTime(time, "UTC")).toContain("3 Aug 2026");
});
