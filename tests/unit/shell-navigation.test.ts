import { describe, expect, it } from "vitest";
import {
  isNavigationActive,
  navigationItems,
  visibleNavigation,
} from "@/lib/shell-navigation";

describe("rail navigation", () => {
  it("shows only explicitly allowed destinations in specification order", () => {
    expect(visibleNavigation([])).toEqual([]);
    expect(
      visibleNavigation(["settings", "patients"]).map((item) => item.id),
    ).toEqual(["patients", "settings"]);
    expect(navigationItems.filter((item) => item.group === "top")).toHaveLength(
      7,
    );
  });
  it("selects nested screens without selecting similarly named routes", () => {
    expect(isNavigationActive("/patients/123", "/patients")).toBe(true);
    expect(isNavigationActive("/patients", "/patients")).toBe(true);
    expect(isNavigationActive("/patients-other", "/patients")).toBe(false);
  });
});
