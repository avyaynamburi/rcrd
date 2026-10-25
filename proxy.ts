import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isMobileDevice } from "@/lib/auth/validation";
import { authConfigured } from "@/lib/supabase/server";

export async function proxy(request: NextRequest) {
  if (!authConfigured()) return NextResponse.next();
  let response = NextResponse.next({ request });
  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure: request.nextUrl.protocol === "https:",
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (values) => {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  // Enforce on every request, including RSC navigation; layouts can be reused by Next.
  const protectedPath =
    /^\/(calendar|dashboard|patients|reports|admin|crm|settings|whatsapp|notifications|account)(\/|$)/.test(
      request.nextUrl.pathname,
    );
  let authorized = false;
  try {
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (user && !error && protectedPath) {
      const { data: member } = await client
        .from("memberships")
        .select("login_enabled,mobile_access_enabled")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .single();
      const { data: org } = await client.rpc("auth_org_id");
      authorized = Boolean(
        org &&
        member?.login_enabled &&
        (member.mobile_access_enabled ||
          !isMobileDevice(request.headers.get("user-agent") ?? "")),
      );
    }
  } catch {
    /* Authentication/provider failure must deny protected requests. */
  }
  if (protectedPath && !authorized) {
    const denied = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.getAll().forEach((cookie) => denied.cookies.set(cookie));
    denied.headers.set("Cache-Control", "private, no-store");
    return denied;
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = {
  matcher: [
    "/((?!api/health|_next/static|_next/image|favicon.ico|icons|sw.js|manifest.webmanifest).*)",
  ],
};
