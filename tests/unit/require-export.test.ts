import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ account: vi.fn(), rpc: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ getAccount: mocks.account }));
import { requireExport } from "@/lib/permissions/require-export";
beforeEach(() => {
  vi.resetAllMocks();
  mocks.account.mockResolvedValue({ client: { rpc: mocks.rpc } });
});
it("rejects unauthenticated callers", async () => {
  mocks.account.mockResolvedValue(null);
  await expect(requireExport()).rejects.toThrow("Permission denied");
  expect(mocks.rpc).not.toHaveBeenCalled();
});
it.each([false, null, undefined, "true"])(
  "fails closed for %s",
  async (data) => {
    mocks.rpc.mockResolvedValue({ data, error: null });
    await expect(requireExport()).rejects.toThrow("Permission denied");
  },
);
it("rejects database failure even with true data", async () => {
  mocks.rpc.mockResolvedValue({ data: true, error: {} });
  await expect(requireExport()).rejects.toThrow("Permission denied");
});
it("returns the authorized account only after a fresh server check", async () => {
  mocks.rpc.mockResolvedValue({ data: true, error: null });
  expect(await requireExport()).toHaveProperty("client");
  expect(mocks.rpc).toHaveBeenCalledWith("can_export");
});
