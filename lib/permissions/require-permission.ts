import { getAccount } from "@/lib/auth/session";

/** Only account capabilities exist yet. Unknown/future area permissions stay denied. */
export async function requirePermission(
  area: "accounts",
  action: "change_password" | "manage_logins",
) {
  const account = await getAccount();
  if (
    !account ||
    area !== "accounts" ||
    (action !== "change_password" && action !== "manage_logins") ||
    (action === "manage_logins" && !account.member.is_owner)
  ) {
    throw new Error("Permission denied");
  }
  return account;
}
