import { describe, expect, it } from "vitest";
import { stampDate, stampUser } from "@/lib/records/stamps";

describe("record stamps", () => {
  it("shows India time across a UTC date boundary", () => {
    expect(stampDate("2026-10-25T20:00:00Z")).toContain("26 Oct 2026");
    expect(stampDate("2026-10-25T20:00:00Z")).toContain("1:30");
  });
  it("supports center timezones and missing historical metadata", () => {
    expect(stampDate("2026-10-25T20:00:00Z", "UTC")).toContain("25 Oct 2026");
    expect(stampDate("invalid")).toBe("Date unavailable");
    expect(stampUser(null, {})).toBe("User unavailable");
    expect(stampUser("staff@example.invalid", {})).toBe(
      "staff@example.invalid",
    );
    expect(stampUser("id", { id: "Synthetic staff" })).toBe("Synthetic staff");
  });
});
