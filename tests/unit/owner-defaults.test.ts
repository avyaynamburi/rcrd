import { describe, expect, it } from "vitest";
import { clinicRoles } from "@/lib/permissions/roles";
import { defaultGrid, gridActions } from "@/lib/permissions/access-grid";
import {
  getDefaultPermissions,
  ownerDefaultAreas,
  permissionActions,
} from "@/lib/permissions/presets";

describe("ACC-14 owner-only defaults", () => {
  it("covers every restricted administration capability", () => {
    expect(ownerDefaultAreas).toEqual([
      "treatment_settings",
      "settings",
      "access_audit",
      "users",
      "ai_settings",
      "import",
      "patient_merge",
      "plan_purchases",
    ]);
  });

  it.each(clinicRoles)(
    "enforces restricted defaults for %s in presets and grids",
    (role) => {
      const owner = role === "owner" || role === "owner_doctor";
      const preset = getDefaultPermissions(role);
      const grid = defaultGrid(role);
      for (const area of ownerDefaultAreas) {
        for (const action of permissionActions)
          expect(preset.areas[area][action], `${area}.${action}`).toBe(owner);
        for (const action of gridActions)
          expect(grid[area][action].day, `${area}.${action}`).toBe(
            owner ? "any" : "none",
          );
      }
      // ACC-05's explicit accountant preset is the exception to ACC-14.
      const financial = owner || role === "accountant";
      expect(preset.areas.accounting.view).toBe(financial);
      expect(preset.areas.accounting.entry).toBe(financial);
      expect(preset.financialReports).toBe(financial);
      expect(preset.areas.reports.report).toBe(financial);
    },
  );

  it("keeps an owner-approved override distinct from defaults", () => {
    const override = defaultGrid("staff");
    override.settings.edit = { day: "same", others: false };
    expect(defaultGrid("staff").settings.edit.day).toBe("none");
    expect(override.settings.edit).toEqual({ day: "same", others: false });
  });
});
