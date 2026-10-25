import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { AccessDatabase } from "./access-contract";

export function authConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function createAuthClient() {
  if (!authConfigured()) return null;
  const store = await cookies();
  return createServerClient<AccessDatabase>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure:
          process.env.NODE_ENV === "production" &&
          !process.env.NEXT_PUBLIC_SUPABASE_URL!.startsWith("http://127.0.0.1"),
      },
      cookies: {
        getAll: () => store.getAll(),
        setAll: (values) => {
          try {
            values.forEach(({ name, value, options }) =>
              store.set(name, value, options),
            );
          } catch {
            /* Server Components cannot refresh cookies; proxy handles refresh. */
          }
        },
      },
    },
  );
}
