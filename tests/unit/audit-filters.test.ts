import { describe, expect, it } from "vitest";
import {
  auditFilters,
  filterInput,
  indiaMidnight,
  nextDay,
} from "@/lib/audit/filters";
describe("audit filters", () => {
  it("validates bounds and identifiers", () => {
    for (const input of [
      { from: "2026-02-30" },
      { page: 0 },
      { page: "1.5" },
      { center: "foreign" },
      { from: "2026-10-25", to: "2026-10-24" },
    ])
      expect(auditFilters.safeParse(input).success).toBe(false);
    expect(auditFilters.parse(filterInput({ from: "", page: "2" })).page).toBe(
      2,
    );
  });
  it("rejects repeated filter values", () => {
    expect(auditFilters.safeParse(filterInput({ user: ["bad"] })).success).toBe(
      false,
    );
  });
  it("uses inclusive IST date bounds across year and leap boundaries", () => {
    expect(indiaMidnight("2026-10-25")).toBe("2026-10-25T00:00:00+05:30");
    expect(nextDay("2024-02-28")).toBe("2024-02-29");
    expect(nextDay("2026-12-31")).toBe("2027-01-01");
  });
});
