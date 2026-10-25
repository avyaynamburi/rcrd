import { afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createAuthClient: mocks.createClient,
}));
import { GET } from "@/app/auth/confirm/route";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetAllMocks();
});

it("keeps recovery on the public origin when Next exposes an internal hostname", async () => {
  vi.stubEnv("AUTH_SITE_URL", "https://clinic.example.invalid");
  const verifyOtp = vi.fn().mockResolvedValue({ error: null });
  mocks.createClient.mockResolvedValue({ auth: { verifyOtp } });
  const response = await GET(
    new NextRequest(
      "http://localhost:3000/auth/confirm?token_hash=synthetic&type=recovery&next=https://untrusted.invalid",
    ),
  );
  expect(verifyOtp).toHaveBeenCalledWith({
    token_hash: "synthetic",
    type: "recovery",
  });
  expect(response.headers.get("location")).toBe(
    "https://clinic.example.invalid/account/password",
  );
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(response.headers.get("referrer-policy")).toBe("no-referrer");
});

it("rejects invalid recovery on the same public origin without exposing the token", async () => {
  vi.stubEnv("AUTH_SITE_URL", "https://clinic.example.invalid");
  mocks.createClient.mockResolvedValue({
    auth: {
      verifyOtp: vi.fn().mockResolvedValue({ error: new Error("invalid") }),
    },
  });
  const response = await GET(
    new NextRequest(
      "http://localhost:3000/auth/confirm?token_hash=synthetic&type=recovery",
    ),
  );
  expect(response.headers.get("location")).toBe(
    "https://clinic.example.invalid/forgot-password?invalid=1",
  );
});
