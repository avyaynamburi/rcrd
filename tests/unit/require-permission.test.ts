import { beforeEach, expect, it, vi } from "vitest";
import { defaultGrid } from "@/lib/permissions/access-grid";
const mocks = vi.hoisted(() => ({ account: vi.fn(), single: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ getAccount: mocks.account }));
import { requirePermission } from "@/lib/permissions/require-permission";
const record = {
  orgId: "org",
  centerId: "center",
  date: new Date().toISOString(),
  createdBy: "actor",
};
function account(role = "staff", grid: unknown = null) {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    single: mocks.single,
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.is.mockReturnValue(query);
  return {
    user: { id: "actor" },
    member: {
      org_id: "org",
      is_owner: role === "owner" || role === "owner_doctor",
      base_role: role,
      access_grid: grid,
    },
    client: { from: vi.fn().mockReturnValue(query) },
  };
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.account.mockResolvedValue(account());
  mocks.single.mockResolvedValue({
    data: { id: "center", timezone: "Asia/Kolkata" },
    error: null,
  });
});
it("fails closed without an active account", async () => {
  mocks.account.mockResolvedValue(null);
  await expect(requirePermission("patient", "entry", record)).rejects.toThrow(
    "Permission denied",
  );
});
it.each(["owner", "owner_doctor", "doctor", "staff", "accountant"])(
  "enforces allowed and denied preset writes for %s",
  async (role) => {
    mocks.account.mockResolvedValue(account(role));
    const allowed = role === "accountant" ? "accounting" : "patient";
    await expect(
      requirePermission(allowed, "entry", record),
    ).resolves.toBeTruthy();
    if (role !== "owner" && role !== "owner_doctor")
      await expect(
        requirePermission("users", "edit", record),
      ).rejects.toThrow();
    else
      await expect(
        requirePermission("patient", "edit", { ...record, orgId: "foreign" }),
      ).rejects.toThrow();
  },
);
it("denies revoked centers, query failures and cross-org records", async () => {
  await expect(
    requirePermission("patient", "entry", { ...record, orgId: "foreign" }),
  ).rejects.toThrow();
  expect(mocks.single).not.toHaveBeenCalled();
  mocks.single.mockResolvedValue({ data: null, error: null });
  await expect(requirePermission("patient", "entry", record)).rejects.toThrow();
  mocks.single.mockResolvedValue({
    data: { timezone: "Asia/Kolkata" },
    error: new Error(),
  });
  await expect(requirePermission("patient", "entry", record)).rejects.toThrow();
});
it("uses saved restrictions rather than role defaults", async () => {
  const grid = defaultGrid("staff");
  grid.patient.edit = { day: "same", others: false };
  mocks.account.mockResolvedValue(account("staff", grid));
  await expect(
    requirePermission("patient", "edit", record),
  ).resolves.toBeTruthy();
  await expect(
    requirePermission("patient", "edit", { ...record, createdBy: "other" }),
  ).rejects.toThrow();
  await expect(
    requirePermission("patient", "edit", {
      ...record,
      date: "2000-01-01T00:00:00Z",
    }),
  ).rejects.toThrow();
});
it("denies malformed overrides and dates", async () => {
  mocks.account.mockResolvedValue(account("owner", {}));
  await expect(requirePermission("patient", "entry", record)).rejects.toThrow();
  await expect(
    requirePermission("patient", "entry", { ...record, date: "invalid" }),
  ).rejects.toThrow();
});
it("keeps account administration owner-only", async () => {
  await expect(
    requirePermission("accounts", "change_password"),
  ).resolves.toBeTruthy();
  await expect(
    requirePermission("accounts", "manage_logins"),
  ).rejects.toThrow();
  mocks.account.mockResolvedValue(account("owner"));
  await expect(
    requirePermission("accounts", "manage_logins"),
  ).resolves.toBeTruthy();
});
