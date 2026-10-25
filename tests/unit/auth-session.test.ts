import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ client: vi.fn(), headers: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createAuthClient: mocks.client }));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
import { getAccount } from "@/lib/auth/session";
const member = {
  id: "synthetic-member",
  org_id: "synthetic-org",
  login_enabled: true,
  deleted_at: null,
  mobile_access_enabled: true,
  is_owner: false,
  base_role: "doctor",
};
let membership = { ...member };
const getUser = vi.fn();
const single = vi.fn();
const from = vi.fn();
beforeEach(() => {
  vi.resetAllMocks();
  membership = { ...member };
  mocks.headers.mockResolvedValue(new Headers({ "user-agent": "Windows NT" }));
  getUser.mockResolvedValue({
    data: { user: { id: "synthetic-user" } },
    error: null,
  });
  single.mockImplementation(async () => ({ data: membership }));
  const query = { select: () => query, eq: () => query, single };
  from.mockImplementation((table) =>
    table === "memberships"
      ? query
      : {
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { name: "Synthetic clinic" } }),
            }),
          }),
        },
  );
  mocks.client.mockResolvedValue({ auth: { getUser }, from });
});
describe("live account authorization", () => {
  it("requires an Auth server verified identity and active membership", async () => {
    const account = await getAccount();
    expect(account?.org.name).toBe("Synthetic clinic");
    expect(account?.permissions.appointmentVisibility).toBe("own");
    expect(account?.permissions.areas.billing.scope).toBe("own_treatment");
    expect(account?.permissions.areas.settings.entry).toBe(false);
    membership.login_enabled = false;
    expect(await getAccount()).toBeNull();
  });
  it("refuses missing, deleted, provider-revoked and failed database membership", async () => {
    single.mockResolvedValue({ data: null });
    expect(await getAccount()).toBeNull();
    getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect(await getAccount()).toBeNull();
    mocks.client.mockRejectedValue(new Error("offline"));
    expect(await getAccount()).toBeNull();
  });
  it("denies an existing identity whose membership was soft deleted", async () => {
    single.mockResolvedValue({
      data: { ...member, deleted_at: "2026-10-25T10:00:00Z" },
    });
    expect(await getAccount()).toBeNull();
  });
  it("rejects phones/tablets when disabled, including existing sessions", async () => {
    membership.mobile_access_enabled = false;
    for (const ua of ["iPhone", "Android", "iPad"]) {
      mocks.headers.mockResolvedValue(new Headers({ "user-agent": ua }));
      expect(await getAccount()).toBeNull();
    }
    mocks.headers.mockResolvedValue(
      new Headers({ "user-agent": "Windows NT" }),
    );
    expect(await getAccount()).not.toBeNull();
  });
});
