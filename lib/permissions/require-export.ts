import { getAccount } from "@/lib/auth/session";

/** Additional restriction only: callers must authorize the area's rows and center separately.
 * Use for Excel, PDF and print responses before querying or rendering any records.
 * Never accept a client-supplied restriction or fall back to role defaults.
 */
export async function requireExport() {
  const account = await getAccount();
  if (!account) throw new Error("Permission denied");
  const { data, error } = await account.client.rpc("can_export");
  if (error || data !== true) throw new Error("Permission denied");
  return account;
}
