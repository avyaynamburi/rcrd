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
import { saveAppointmentVisibility } from "@/lib/actions/appointment-visibility";

const input = {
  membershipId: "30000000-0000-4000-8000-000000000002",
  visibility: "own",
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.permission.mockResolvedValue({ client: { rpc: mocks.rpc } });
  mocks.rpc.mockResolvedValue({ error: null });
});
it("validates before permission or write", async () => {
  expect(
    (await saveAppointmentVisibility({ ...input, visibility: "invalid" }))
      .success,
  ).toBe(false);
  expect(mocks.permission).not.toHaveBeenCalled();
});
it("denies without permission", async () => {
  mocks.permission.mockRejectedValue(new Error("denied"));
  expect((await saveAppointmentVisibility(input)).success).toBe(false);
  expect(mocks.rpc).not.toHaveBeenCalled();
});
it("uses the audited atomic RPC and refreshes on success", async () => {
  expect((await saveAppointmentVisibility(input)).success).toBe(true);
  expect(mocks.permission).toHaveBeenCalledWith("accounts", "manage_logins");
  expect(mocks.rpc).toHaveBeenCalledWith("set_appointment_visibility", {
    target_membership_id: input.membershipId,
    visibility: input.visibility,
  });
  expect(mocks.revalidate).toHaveBeenCalledWith("/", "layout");
});
it("reports DB failures without success or refresh", async () => {
  mocks.rpc.mockResolvedValue({ error: { message: "denied" } });
  expect((await saveAppointmentVisibility(input)).success).toBe(false);
  expect(mocks.revalidate).not.toHaveBeenCalled();
});
