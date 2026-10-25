import { describe, expect, it } from "vitest";
import { readOpenGroups } from "@/lib/second-menu";

describe("second menu preferences", () => {
  it("retains only known group names", () => {
    expect(
      readOpenGroups('["Team", 1, "unknown", "Lab"]', ["Team", "Lab"]),
    ).toEqual(["Team", "Lab"]);
  });
  it("recovers from missing, malformed and unexpected stored values", () => {
    for (const raw of [null, "{", '"Team"', "{}"])
      expect(readOpenGroups(raw, ["Team"])).toEqual([]);
  });
});
