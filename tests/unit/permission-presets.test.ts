import { describe, expect, it } from "vitest";
import { clinicRoles } from "@/lib/permissions/roles";
import {
  getDefaultPermissions,
  permissionAreas,
  permissionActions,
  canRefundByDefault,
} from "@/lib/permissions/presets";

describe("ACC-05 permission presets", () => {
  it.each(["owner", "owner_doctor"])(
    "gives %s every clinic capability",
    (role) => {
      const preset = getDefaultPermissions(role);
      for (const area of permissionAreas) {
        for (const action of permissionActions)
          expect(preset.areas[area][action]).toBe(true);
        expect(preset.areas[area].scope).toBe("all");
      }
      expect(preset.appointmentVisibility).toBe("all");
      expect(preset.financialReports).toBe(true);
      expect(preset.exportReports).toBe(true);
      expect(canRefundByDefault(role)).toBe(true);
    },
  );
  it.each([
    [
      "doctor",
      [
        "patient",
        "appointment",
        "clinical_notes",
        "treatment_plan",
        "treatment_done",
        "prescription",
        "files",
        "charting",
        "billing",
      ],
    ],
    ["staff", ["patient", "appointment", "billing", "receipts", "messaging"]],
    [
      "accountant",
      [
        "billing",
        "receipts",
        "credit_notes",
        "expenses",
        "accounting",
        "inventory",
        "lab",
        "reports",
      ],
    ],
  ] as const)("grants only the documented areas for %s", (role, allowed) => {
    const preset = getDefaultPermissions(role);
    for (const area of permissionAreas) {
      const permitted = (allowed as readonly string[]).includes(area);
      expect(preset.areas[area].view, area).toBe(permitted);
      expect(preset.areas[area].entry, area).toBe(
        permitted && area !== "reports",
      );
      expect(preset.areas[area].edit, area).toBe(
        permitted &&
          area !== "reports" &&
          !(role === "staff" && area === "receipts"),
      );
      expect(preset.areas[area].delete, area).toBe(false);
      expect(preset.areas[area].report, area).toBe(
        role === "accountant" && area === "reports",
      );
    }
  });
  it("retains doctor scopes and front desk collection without refund authority", () => {
    const doctor = getDefaultPermissions("doctor");
    expect(doctor.appointmentVisibility).toBe("own");
    expect(doctor.areas.patient.scope).toBe("own_or_shared");
    expect(doctor.areas.billing.scope).toBe("own_treatment");
    expect(doctor.financialReports).toBe(false);
    expect(doctor.exportReports).toBe(false);
    expect(getDefaultPermissions("staff").appointmentVisibility).toBe("all");
    expect(getDefaultPermissions("staff").areas.patient.scope).toBe(
      "registration_contact",
    );
    expect(getDefaultPermissions("accountant").areas.lab.scope).toBe(
      "financial",
    );
    expect(getDefaultPermissions("accountant").areas.reports.scope).toBe(
      "financial",
    );
    expect(canRefundByDefault("staff")).toBe(false);
    expect(canRefundByDefault("doctor")).toBe(false);
    expect(canRefundByDefault("accountant")).toBe(true);
  });
  it.each([
    null,
    undefined,
    "platform_admin",
    "consultant",
    "marketing",
    "toString",
    {},
  ])("denies unknown or tag-only role %j", (role) => {
    const preset = getDefaultPermissions(role);
    for (const area of permissionAreas) {
      for (const action of permissionActions)
        expect(preset.areas[area][action]).toBe(false);
      expect(preset.areas[area].scope).toBe("none");
    }
    expect(canRefundByDefault(role)).toBe(false);
  });
  it.each(clinicRoles)("returns isolated defaults for %s", (role) => {
    const expected = getDefaultPermissions(role);
    const first = getDefaultPermissions(role);
    first.areas.patient = getDefaultPermissions("owner").areas.patient;
    first.exportReports = !first.exportReports;
    expect(getDefaultPermissions(role)).toEqual(expected);
    expect(getDefaultPermissions(role).exportReports).not.toBe(
      first.exportReports,
    );
  });
});
