import { beforeEach, describe, expect, it, vi } from "vitest";
const { getAccount } = vi.hoisted(() => ({ getAccount: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ getAccount }));
import { readAudit } from "@/lib/audit/read";
describe("owner audit reads", () => {
  beforeEach(() => vi.clearAllMocks());
  it("denies missing account and non-owners before queries", async () => {
    for (const account of [null, { member: { is_owner: false } }]) {
      getAccount.mockResolvedValue(account);
      await expect(readAudit({})).rejects.toThrow("Forbidden");
    }
  });
  it("checks the persisted export restriction before loading records", async () => {
    const from = vi.fn();
    getAccount.mockResolvedValue({
      member: { is_owner: true },
      client: {
        from,
        rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
      },
    });
    await expect(readAudit({}, true)).rejects.toThrow("Forbidden");
    expect(from).not.toHaveBeenCalled();
  });
  it("applies org and India date bounds and stable page limits", async () => {
    const query: Record<string, ReturnType<typeof vi.fn>> = {};
    for (const key of ["select", "eq", "order", "gte", "lt"])
      query[key] = vi.fn().mockReturnValue(query);
    query.range = vi
      .fn()
      .mockResolvedValue({ data: [], count: 0, error: null });
    getAccount.mockResolvedValue({
      member: { is_owner: true, org_id: "trusted-org" },
      client: { from: vi.fn().mockReturnValue(query) },
    });
    await readAudit({
      from: "2026-10-25",
      to: "2026-10-25",
      page: "2",
      action: "export",
    });
    expect(query.eq).toHaveBeenCalledWith("org_id", "trusted-org");
    expect(query.gte).toHaveBeenCalledWith(
      "created_at",
      "2026-10-25T00:00:00+05:30",
    );
    expect(query.lt).toHaveBeenCalledWith(
      "created_at",
      "2026-10-26T00:00:00+05:30",
    );
    expect(query.range).toHaveBeenCalledWith(50, 99);
    expect(query.order).toHaveBeenCalledWith("id", { ascending: false });
  });
});
