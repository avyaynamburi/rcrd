import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getAccount: vi.fn(),
  redirect: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({
  createAuthClient: mocks.createClient,
}));
vi.mock("@/lib/auth/session", () => ({ getAccount: mocks.getAccount }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
import {
  changePassword,
  requestPasswordReset,
  setLoginAccess,
  signIn,
  signOut,
} from "@/lib/actions/auth";
import { en } from "@/lib/i18n/en";

const client = {
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
  rpc: vi.fn(),
};
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("AUTH_SITE_URL", "http://127.0.0.1:3000");
  mocks.createClient.mockResolvedValue(client);
  mocks.getAccount.mockResolvedValue({ client, member: { is_owner: true } });
  client.auth.signInWithPassword.mockResolvedValue({ error: null });
  client.auth.signOut.mockResolvedValue({ error: null });
  client.auth.updateUser.mockResolvedValue({ error: null });
  client.auth.resetPasswordForEmail.mockResolvedValue({ error: null });
  client.rpc.mockResolvedValue({ error: null });
});
describe("authentication actions", () => {
  it("normalizes login and opens Calendar only after live account authorization", async () => {
    await signIn({ identifier: "9876543210", password: "synthetic-password" });
    expect(client.auth.signInWithPassword).toHaveBeenCalledWith({
      phone: "+919876543210",
      password: "synthetic-password",
    });
    expect(mocks.getAccount).toHaveBeenCalled();
    expect(mocks.redirect).toHaveBeenCalledWith("/calendar");
  });
  it("clears a denied identity session and never opens the app", async () => {
    mocks.getAccount.mockResolvedValue(null);
    expect(
      await signIn({
        identifier: "synthetic@example.invalid",
        password: "synthetic-password",
      }),
    ).toEqual({ message: en.auth.failed });
    expect(client.auth.signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
  it("does not query credentials after validation failure or leak provider messages", async () => {
    await signIn({ identifier: "invalid", password: "synthetic" });
    expect(client.auth.signInWithPassword).not.toHaveBeenCalled();
    client.auth.signInWithPassword.mockResolvedValue({
      error: { message: "sensitive provider details" },
    });
    expect(
      await signIn({
        identifier: "synthetic@example.invalid",
        password: "synthetic-password",
      }),
    ).toEqual({ message: en.auth.failed });
    expect(mocks.getAccount).not.toHaveBeenCalled();
  });
  it("returns the same recovery response for unknown accounts and provider errors", async () => {
    const expected = { message: en.auth.resetSent, success: true };
    expect(
      await requestPasswordReset({ email: "synthetic@example.invalid" }),
    ).toEqual(expected);
    client.auth.resetPasswordForEmail.mockResolvedValue({
      error: { message: "rate limit" },
    });
    expect(
      await requestPasswordReset({ email: "synthetic@example.invalid" }),
    ).toEqual(expected);
    expect(client.auth.resetPasswordForEmail).toHaveBeenLastCalledWith(
      "synthetic@example.invalid",
      { redirectTo: "http://127.0.0.1:3000/auth/confirm" },
    );
  });
  it("refuses password changes without an active account or matching valid input", async () => {
    const input = {
      password: "synthetic-password",
      confirmPassword: "synthetic-password",
    };
    mocks.getAccount.mockResolvedValue(null);
    await changePassword(input);
    expect(client.auth.updateUser).not.toHaveBeenCalled();
    await changePassword({ ...input, confirmPassword: "different" });
    expect(client.auth.updateUser).not.toHaveBeenCalled();
  });
  it("changes passwords via Auth and reports failure to revoke other sessions honestly", async () => {
    const input = {
      password: "synthetic-password",
      confirmPassword: "synthetic-password",
    };
    expect((await changePassword(input)).success).toBe(true);
    expect(client.auth.signOut).toHaveBeenCalledWith({ scope: "others" });
    client.auth.signOut.mockResolvedValue({ error: { message: "failure" } });
    expect(await changePassword(input)).toEqual({
      message: en.auth.passwordRevokeFailed,
    });
  });
  it("checks owner capability before the narrow audited access RPC", async () => {
    const input = {
      membershipId: "22222222-2222-4222-8222-222222222222",
      enabled: false,
      mobileEnabled: false,
    };
    mocks.getAccount.mockResolvedValue({ client, member: { is_owner: false } });
    await setLoginAccess(input);
    expect(client.rpc).not.toHaveBeenCalled();
    mocks.getAccount.mockResolvedValue({ client, member: { is_owner: true } });
    expect((await setLoginAccess(input)).success).toBe(true);
    expect(client.rpc).toHaveBeenCalledWith("set_login_access", {
      target_membership_id: input.membershipId,
      enabled: false,
      mobile_enabled: false,
    });
  });
  it("redirects only after successful global sign-out", async () => {
    client.auth.signOut.mockResolvedValue({ error: { message: "failure" } });
    await signOut();
    expect(mocks.redirect).not.toHaveBeenCalled();
    client.auth.signOut.mockResolvedValue({ error: null });
    await signOut();
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
  });
  it("fails closed when configuration or network is unavailable", async () => {
    mocks.createClient.mockResolvedValue(null);
    expect(
      await signIn({
        identifier: "synthetic@example.invalid",
        password: "synthetic-password",
      }),
    ).toEqual({ message: en.auth.unavailable });
    expect(mocks.redirect).not.toHaveBeenCalled();
    mocks.createClient.mockRejectedValue(new Error("network"));
    expect(await signOut()).toEqual({ message: en.auth.unavailable });
  });
});
