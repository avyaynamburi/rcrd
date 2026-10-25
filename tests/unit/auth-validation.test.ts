import { describe, expect, it } from "vitest";
import {
  loginIdentity,
  loginSchema,
  changePasswordSchema,
  loginAccessSchema,
  isMobileDevice,
} from "@/lib/auth/validation";

describe("individual account validation", () => {
  it("accepts email, Indian local and explicit international mobile identifiers", () => {
    expect(loginIdentity("synthetic@example.invalid")).toEqual({
      email: "synthetic@example.invalid",
    });
    expect(loginIdentity("98765 43210")).toEqual({ phone: "+919876543210" });
    expect(loginIdentity("+1 (202) 555-0123")).toEqual({
      phone: "+12025550123",
    });
    for (const invalid of [
      "123",
      "bad@",
      "001234567890",
      "invalid",
      "1234567890",
    ])
      expect(loginIdentity(invalid)).toBeNull();
  });
  it("does not trim passwords and rejects extra fields or oversized credentials", () => {
    expect(
      loginSchema.parse({
        identifier: " synthetic@example.invalid ",
        password: " secret ",
      }).password,
    ).toBe(" secret ");
    expect(
      loginSchema.safeParse({
        identifier: "a",
        password: "b",
        org_id: "forged",
      }).success,
    ).toBe(false);
    expect(
      loginSchema.safeParse({ identifier: "a", password: "x".repeat(129) })
        .success,
    ).toBe(false);
  });
  it("requires matching bounded new passwords and typed account access", () => {
    expect(
      changePasswordSchema.safeParse({
        password: "short",
        confirmPassword: "short",
      }).success,
    ).toBe(false);
    expect(
      changePasswordSchema.safeParse({
        password: "synthetic-password-1",
        confirmPassword: "different",
      }).success,
    ).toBe(false);
    expect(
      changePasswordSchema.safeParse({
        password: "synthetic-password-1",
        confirmPassword: "synthetic-password-1",
      }).success,
    ).toBe(true);
    expect(
      loginAccessSchema.safeParse({
        membershipId: "forged",
        enabled: "true",
        mobileEnabled: true,
      }).success,
    ).toBe(false);
  });
  it("identifies normal mobile/tablet browsers while documenting the desktop-mode limitation", () => {
    for (const ua of [
      "Mozilla iPhone",
      "Mozilla Android",
      "Mozilla iPad",
      "Tablet",
    ])
      expect(isMobileDevice(ua)).toBe(true);
    for (const ua of ["Mozilla Windows NT", "Mozilla Macintosh", ""])
      expect(isMobileDevice(ua)).toBe(false);
  });
});
