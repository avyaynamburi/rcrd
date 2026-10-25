import { roleSchema, isOwnerRole } from "./roles";

export const permissionAreas = [
  "patient",
  "appointment",
  "treatment_settings",
  "clinical_notes",
  "treatment_plan",
  "treatment_done",
  "prescription",
  "files",
  "charting",
  "billing",
  "receipts",
  "credit_notes",
  "expenses",
  "accounting",
  "inventory",
  "lab",
  "tasks",
  "crm",
  "messaging",
  "reports",
  "settings",
  "nabh",
  "membership",
  "ai",
  "access_audit",
  "users",
  "ai_settings",
  "import",
  "patient_merge",
  "plan_purchases",
] as const;
export type PermissionArea = (typeof permissionAreas)[number];

/** ACC-14: default restrictions only; persisted owner-approved grids may differ.
 * ACC-05 explicitly grants accountants accounting and financial reports.
 */
export const ownerDefaultAreas = [
  "treatment_settings",
  "settings",
  "access_audit",
  "users",
  "ai_settings",
  "import",
  "patient_merge",
  "plan_purchases",
] as const satisfies readonly PermissionArea[];

export const permissionActions = [
  "view",
  "entry",
  "edit",
  "delete",
  "report",
] as const;
export type PermissionAction = (typeof permissionActions)[number];
export type RecordScope =
  | "none"
  | "all"
  | "own_or_shared"
  | "own_treatment"
  | "registration_contact"
  | "financial";
export type PermissionRule = Readonly<
  Record<PermissionAction, boolean> & { scope: RecordScope }
>;
export type PermissionPreset = {
  areas: Record<PermissionArea, PermissionRule>;
  appointmentVisibility: "all" | "own";
  financialReports: boolean;
  exportReports: boolean;
};

/** Defaults for a newly provisioned base role. Tags never silently elevate access.
 * Callers must also enforce tenant/center access and the rule's record scope.
 * ACC-06 will persist owner overrides; these defaults are not that access grid.
 */
export function getDefaultPermissions(role: unknown): PermissionPreset {
  const parsed = roleSchema.safeParse(role);
  const areas = Object.fromEntries(
    permissionAreas.map((area) => [
      area,
      {
        view: false,
        entry: false,
        edit: false,
        delete: false,
        report: false,
        scope: "none",
      },
    ]),
  ) as Record<PermissionArea, PermissionRule>;
  const preset: PermissionPreset = {
    areas,
    appointmentVisibility: "own",
    financialReports: false,
    exportReports: false,
  };
  if (!parsed.success) return preset;
  const grant = (names: PermissionArea[], scope: RecordScope = "all") => {
    for (const name of names)
      areas[name] = {
        view: true,
        entry: true,
        edit: true,
        delete: false,
        report: false,
        scope,
      };
  };
  if (isOwnerRole(parsed.data)) {
    for (const area of permissionAreas)
      areas[area] = {
        view: true,
        entry: true,
        edit: true,
        delete: true,
        report: true,
        scope: "all",
      };
    preset.appointmentVisibility = "all";
    preset.financialReports = true;
    preset.exportReports = true;
  } else if (parsed.data === "doctor") {
    grant(
      [
        "patient",
        "appointment",
        "clinical_notes",
        "treatment_plan",
        "treatment_done",
        "prescription",
        "files",
        "charting",
      ],
      "own_or_shared",
    );
    // Bills may only cover this doctor's treatments. No receipts/refunds by default.
    grant(["billing"], "own_treatment");
  } else if (parsed.data === "staff") {
    grant(["patient"], "registration_contact");
    grant(["appointment", "billing", "messaging"]);
    // Front desk can collect payments; refunds are a separate, denied capability.
    areas.receipts = {
      view: true,
      entry: true,
      edit: false,
      delete: false,
      report: false,
      scope: "all",
    };
    preset.appointmentVisibility = "all";
  } else if (parsed.data === "accountant") {
    grant([
      "billing",
      "receipts",
      "credit_notes",
      "expenses",
      "accounting",
      "inventory",
      "lab",
    ]);
    grant(["lab"], "financial");
    areas.reports = {
      view: true,
      entry: false,
      edit: false,
      delete: false,
      report: true,
      scope: "financial",
    };
    preset.financialReports = true;
    preset.exportReports = true;
  }
  if (!isOwnerRole(parsed.data)) {
    for (const area of ownerDefaultAreas)
      areas[area] = {
        view: false,
        entry: false,
        edit: false,
        delete: false,
        report: false,
        scope: "none",
      };
  }
  return preset;
}

// Shared areas need explicit sub-capabilities to prevent broader grants.
export function canRefundByDefault(role: unknown): boolean {
  const parsed = roleSchema.safeParse(role);
  return (
    parsed.success && (isOwnerRole(parsed.data) || parsed.data === "accountant")
  );
}
