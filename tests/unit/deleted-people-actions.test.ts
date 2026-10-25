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
import { setPersonDeleted } from "@/lib/actions/deleted-people";
import {
  isDoctorOrOwner,
  personDeletionSchema,
} from "@/lib/permissions/deleted-people";
import { en } from "@/lib/i18n/en";
const input = {
  membershipId: "30000000-0000-4000-8000-000000000002",
  deleted: true,
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.permission.mockResolvedValue({ client: { rpc: mocks.rpc } });
  mocks.rpc.mockResolvedValue({ error: null });
});
it.each([
  {},
  { ...input, deleted: "true" },
  { ...input, membershipId: "bad" },
  { ...input, orgId: "forged" },
])(
  "rejects invalid input before permission and database calls",
  async (invalid) => {
    expect(personDeletionSchema.safeParse(invalid).success).toBe(false);
    expect((await setPersonDeleted(invalid)).success).toBe(false);
    expect(mocks.permission).not.toHaveBeenCalled();
    expect(mocks.rpc).not.toHaveBeenCalled();
  },
);
it("denies callers without live owner permission", async () => {
  mocks.permission.mockRejectedValue(new Error("denied"));
  expect((await setPersonDeleted(input)).success).toBe(false);
  expect(mocks.rpc).not.toHaveBeenCalled();
});
it.each([true, false])(
  "uses the atomic audited RPC for deleted=%s",
  async (deleted) => {
    expect(await setPersonDeleted({ ...input, deleted })).toEqual({
      success: true,
      message: deleted ? en.people.deleted : en.people.restored,
    });
    expect(mocks.permission).toHaveBeenCalledWith("accounts", "manage_logins");
    expect(mocks.rpc).toHaveBeenCalledWith("set_person_deleted", {
      target_membership_id: input.membershipId,
      deleted,
    });
    expect(mocks.revalidate).toHaveBeenCalledWith("/", "layout");
  },
);
it("keeps provider details private and does not refresh on failure", async () => {
  mocks.rpc.mockResolvedValue({ error: { message: "sensitive details" } });
  expect(await setPersonDeleted(input)).toEqual({
    success: false,
    message: en.people.failed,
  });
  expect(mocks.revalidate).not.toHaveBeenCalled();
});
it("groups every clinic role in its matching deleted list", () => {
  for (const role of ["owner", "owner_doctor", "doctor"] as const)
    expect(isDoctorOrOwner(role)).toBe(true);
  for (const role of ["staff", "accountant"] as const)
    expect(isDoctorOrOwner(role)).toBe(false);
});
