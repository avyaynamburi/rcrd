import { getAccount } from "@/lib/auth/session";
import {
  accessGridSchema,
  allowsCell,
  defaultGrid,
  gridActions,
} from "./access-grid";
import { permissionAreas, type PermissionArea } from "./presets";

type Account = NonNullable<Awaited<ReturnType<typeof getAccount>>>;
type RecordContext = {
  orgId: string;
  centerId: string;
  date: string;
  createdBy: string;
};

export function requirePermission(
  area: "accounts",
  action: "change_password" | "manage_logins",
): Promise<Account>;
export function requirePermission(
  area: PermissionArea,
  action: (typeof gridActions)[number],
  record: RecordContext,
): Promise<Account>;
/** Context must come from an RLS-authorized record, never from form/AI input.
 * This guard does not replace transactional database authorization or audit.
 */
export async function requirePermission(
  area: string,
  action: string,
  record?: RecordContext,
): Promise<Account> {
  const deny = (): never => {
    throw new Error("Permission denied");
  };
  const account = await getAccount();
  if (!account) return deny();
  if (area === "accounts") {
    if (
      action === "change_password" ||
      (action === "manage_logins" && account.member.is_owner)
    )
      return account;
    return deny();
  }
  if (
    !permissionAreas.includes(area as PermissionArea) ||
    !gridActions.includes(action as (typeof gridActions)[number]) ||
    !record ||
    record.orgId !== account.member.org_id ||
    !record.centerId ||
    !record.createdBy ||
    !Number.isFinite(new Date(record.date).getTime())
  )
    return deny();
  // The SELECT is subject to active membership, org and center-grant RLS.
  const { data: center, error } = await account.client
    .from("centers")
    .select("id, timezone")
    .eq("id", record.centerId)
    .eq("org_id", record.orgId)
    .is("deleted_at", null)
    .single();
  if (error || !center) return deny();
  const parsed = accessGridSchema.safeParse(account.member.access_grid);
  // Only a missing override uses defaults; malformed persisted overrides deny.
  const grid =
    account.member.access_grid === null
      ? defaultGrid(account.member.base_role)
      : parsed.success
        ? parsed.data
        : null;
  if (!grid) return deny();
  try {
    if (
      !allowsCell(
        grid,
        area as PermissionArea,
        action as (typeof gridActions)[number],
        record,
        account.user.id,
        new Date(),
        center.timezone,
      )
    )
      return deny();
  } catch {
    return deny();
  }
  return account;
}
