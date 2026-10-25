import { describe, expect, it } from "vitest";
import {
  clinicRoles,
  roleTags,
  memberRoleSchema,
  isOwnerRole,
  hasRoleTag,
} from "@/lib/permissions/roles";
const id = "30000000-0000-4000-8000-000000000001";
describe("clinic roles", () => {
  it.each(clinicRoles)("accepts %s and every supported tag", (role) => {
    expect(
      memberRoleSchema.safeParse({
        membershipId: id,
        role,
        tags: [...roleTags],
      }).success,
    ).toBe(true);
    expect(isOwnerRole(role)).toBe(["owner", "owner_doctor"].includes(role));
  });
  it.each(["platform_admin", "admin", "", null])(
    "rejects unassignable role %s",
    (role) => {
      expect(
        memberRoleSchema.safeParse({ membershipId: id, role, tags: [] })
          .success,
      ).toBe(false);
    },
  );
  it("rejects unknown, duplicate and null tags and injected scope", () => {
    for (const tags of [["owner"], ["consultant", "consultant"], [null]])
      expect(
        memberRoleSchema.safeParse({ membershipId: id, role: "staff", tags })
          .success,
      ).toBe(false);
    expect(
      memberRoleSchema.safeParse({
        membershipId: id,
        role: "staff",
        tags: [],
        orgId: id,
      }).success,
    ).toBe(false);
  });
  it("matches list tags independently of the base role", () => {
    expect(hasRoleTag(["marketing", "tele_caller"], "tele_caller")).toBe(true);
    expect(hasRoleTag([], "consultant")).toBe(false);
  });
});
