import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  permission: vi.fn(),
  rpc: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@/lib/permissions/require-permission", () => ({
  requirePermission: mocks.permission,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
import { setMemberRole } from "@/lib/actions/roles";
const input = {
  membershipId: "30000000-0000-4000-8000-000000000002",
  role: "doctor",
  tags: ["consultant"],
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.permission.mockResolvedValue({ client: { rpc: mocks.rpc } });
  mocks.rpc.mockResolvedValue({ error: null });
});
it("validates before permission or write", async () => {
  expect(
    (await setMemberRole({ ...input, role: "platform_admin" })).success,
  ).toBe(false);
  expect(mocks.permission).not.toHaveBeenCalled();
});
it("denies without permission", async () => {
  mocks.permission.mockRejectedValue(new Error("denied"));
  expect((await setMemberRole(input)).success).toBe(false);
  expect(mocks.rpc).not.toHaveBeenCalled();
});
it("uses the audited atomic RPC and refreshes on success", async () => {
  expect((await setMemberRole(input)).success).toBe(true);
  expect(mocks.permission).toHaveBeenCalledWith("accounts", "manage_logins");
  expect(mocks.rpc).toHaveBeenCalledWith("set_member_role", {
    target_membership_id: input.membershipId,
    new_role: "doctor",
    new_tags: ["consultant"],
  });
  expect(mocks.revalidate).toHaveBeenCalledWith("/account/team");
});
it("reports DB failures without success or refresh", async () => {
  mocks.rpc.mockResolvedValue({ error: { message: "denied" } });
  expect((await setMemberRole(input)).success).toBe(false);
  expect(mocks.revalidate).not.toHaveBeenCalled();
});
