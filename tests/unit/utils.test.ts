import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";
describe("cn", () => {
  it("allows callers to override conflicting Tailwind classes", () => {
    expect(cn("px-4 text-sm", false, undefined, "px-6")).toBe("text-sm px-6");
  });
  it("supports conditional classes", () => {
    expect(cn("base", { hidden: false, block: true })).toBe("base block");
  });
});
