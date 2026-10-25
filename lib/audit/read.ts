import { getAccount } from "@/lib/auth/session";
import { auditFilters, filterInput, indiaMidnight, nextDay } from "./filters";
export async function readAudit(
  input: Record<string, string | string[] | undefined>,
  exporting = false,
) {
  const account = await getAccount();
  if (!account?.member.is_owner) throw new Error("Forbidden");
  if (exporting) {
    const allowed = await account.client.rpc("can_export");
    if (allowed.error || allowed.data !== true) throw new Error("Forbidden");
  }
  const filters = auditFilters.parse(filterInput(input));
  let query = account.client
    .from("access_audit")
    .select("*", { count: "exact" })
    .eq("org_id", account.member.org_id)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });
  if (filters.from)
    query = query.gte("created_at", indiaMidnight(filters.from));
  if (filters.to)
    query = query.lt("created_at", indiaMidnight(nextDay(filters.to)));
  if (filters.user) query = query.eq("actor_id", filters.user);
  if (filters.center) query = query.eq("center_id", filters.center);
  if (filters.area) query = query.eq("area", filters.area);
  if (filters.action) query = query.eq("action", filters.action);
  const offset = (filters.page - 1) * 50;
  const result = await query.range(offset, offset + 49);
  if (result.error) throw new Error("Audit unavailable");
  return { rows: result.data, count: result.count ?? 0, page: filters.page };
}
