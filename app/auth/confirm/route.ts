import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token_hash");
  const client = await createAuthClient();
  if (
    client &&
    token &&
    request.nextUrl.searchParams.get("type") === "recovery"
  ) {
    try {
      const { error } = await client.auth.verifyOtp({
        token_hash: token,
        type: "recovery",
      });
      if (!error)
        return NextResponse.redirect(
          new URL("/account/password", request.url),
          {
            headers: {
              "Cache-Control": "no-store",
              "Referrer-Policy": "no-referrer",
            },
          },
        );
    } catch {
      /* Return only a generic error; never expose a token or provider details. */
    }
  }
  return NextResponse.redirect(
    new URL("/forgot-password?invalid=1", request.url),
    {
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    },
  );
}
