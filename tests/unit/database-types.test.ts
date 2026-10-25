import { describe, expect, it } from "vitest";
import { checkedTypes } from "../../scripts/database-types";

describe("database type generation", () => {
  it("accepts successful generated types", () => {
    const stdout = "export type Json = string | number | null;";
    expect(checkedTypes({ status: 0, stdout })).toBe(stdout);
  });
  it.each([
    { status: 1, stdout: "export type Json = string;" },
    { status: null, stdout: "" },
    { status: 0, stdout: "" },
    { status: 0, stdout: "Docker is unavailable" },
  ])(
    "rejects failed or empty output before replacing existing types",
    (result) => {
      expect(() => checkedTypes(result)).toThrow(
        "Existing types have been preserved",
      );
    },
  );
});
