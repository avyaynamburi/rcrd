import { ExportControl } from "@/components/auth/export-control";
import { memberExportSchema } from "@/lib/permissions/export-control";
import { AppointmentVisibility } from "@/components/auth/appointment-visibility";
import { memberVisibilitySchema } from "@/lib/permissions/appointment-visibility";
import { CenterAccess } from "@/components/auth/center-access";
import { centerAccessSchema } from "@/lib/permissions/center-access";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAccount } from "@/lib/auth/session";
import { AccountAccess } from "@/components/auth/account-access";
import { HelpLink } from "@/components/blocks/help-drawer";
import { en } from "@/lib/i18n/en";

import { MemberRole } from "@/components/auth/member-role";
import { roleSchema, roleTagsSchema } from "@/lib/permissions/roles";

import { AccessGrid } from "@/components/auth/access-grid";
import { accessGridSchema, defaultGrid } from "@/lib/permissions/access-grid";

const memberRolesSchema = z.array(
  z.object({ id: z.uuid(), base_role: roleSchema, role_tags: roleTagsSchema }),
);

const accountsSchema = z.array(
  z.object({
    id: z.uuid(),
    email: z.string().nullable(),
    login_enabled: z.boolean(),
    mobile_access_enabled: z.boolean(),
  }),
);
export default async function Team() {
  const account = await getAccount();
  if (!account?.member.is_owner) redirect("/login");
  const { data, error } = await account.client.rpc("list_login_accounts");
  const accounts = accountsSchema.safeParse(data);
  const centersResult = await account.client.rpc("list_center_access");
  const centers = centerAccessSchema.safeParse(centersResult.data);
  const visibilityResult = await account.client.rpc(
    "list_appointment_visibility",
  );
  const visibility = memberVisibilitySchema.safeParse(visibilityResult.data);
  const exportResult = await account.client.rpc("list_export_disabled");
  const exports = memberExportSchema.safeParse(exportResult.data);
  const rolesResult = await account.client.rpc("list_member_roles");
  const accessResult = await account.client.rpc("list_member_access");
  const access = z
    .array(z.object({ id: z.uuid(), access_grid: accessGridSchema.nullable() }))
    .safeParse(accessResult.data);
  const roles = memberRolesSchema.safeParse(rolesResult.data);
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-5 px-6 py-10">
      <h1 className="text-2xl font-semibold">{en.auth.team}</h1>
      <p>{en.auth.mobileLimit}</p>
      <p>{en.roles.platform}</p>
      {error || !accounts.success ? (
        <p role="alert">{en.auth.teamError}</p>
      ) : accounts.data.length ? (
        accounts.data.map((person) => (
          <section
            key={person.id}
            className="space-y-3 rounded border border-border p-4"
          >
            <AccountAccess
              account={person}
              self={person.id === account.member.id}
            />
            {centers.success && !centersResult.error ? (
              <CenterAccess
                id={person.id}
                centers={centers.data.centers}
                initial={centers.data.grants
                  .filter((g) => g.membershipId === person.id)
                  .map((g) => g.centerId)
                  .sort()}
                self={person.id === account.member.id}
              />
            ) : (
              <p role="alert">{en.auth.teamError}</p>
            )}
            {roles.success &&
            !rolesResult.error &&
            roles.data.find((role) => role.id === person.id) ? (
              (() => {
                const role = roles.data.find((role) => role.id === person.id)!;
                return (
                  <>
                    {visibility.success &&
                    !visibilityResult.error &&
                    visibility.data.find((item) => item.id === person.id) ? (
                      <AppointmentVisibility
                        id={person.id}
                        initial={
                          visibility.data.find((item) => item.id === person.id)!
                            .appointment_visibility
                        }
                        protectedOwner={
                          role.base_role === "owner" ||
                          role.base_role === "owner_doctor"
                        }
                      />
                    ) : (
                      <p role="alert">{en.auth.teamError}</p>
                    )}
                    {exports.success &&
                    !exportResult.error &&
                    exports.data.find((item) => item.id === person.id) ? (
                      <ExportControl
                        id={person.id}
                        initial={
                          exports.data.find((item) => item.id === person.id)!
                            .export_disabled
                        }
                        protectedOwner={
                          role.base_role === "owner" ||
                          role.base_role === "owner_doctor"
                        }
                      />
                    ) : (
                      <p role="alert">{en.auth.teamError}</p>
                    )}
                    <MemberRole
                      id={person.id}
                      initialRole={role.base_role}
                      initialTags={role.role_tags}
                      self={person.id === account.member.id}
                    />
                    {access.success && !accessResult.error ? (
                      <AccessGrid
                        sources={accounts.data.flatMap((source) => {
                          const sourceRole = roles.data.find(
                            (item) => item.id === source.id,
                          );
                          const sourceAccess = access.data.find(
                            (item) => item.id === source.id,
                          );
                          return sourceRole && sourceAccess
                            ? [
                                {
                                  id: source.id,
                                  label: source.email ?? source.id,
                                  grid:
                                    sourceAccess.access_grid ??
                                    defaultGrid(sourceRole.base_role),
                                },
                              ]
                            : [];
                        })}
                        id={person.id}
                        initial={
                          access.data.find((item) => item.id === person.id)
                            ?.access_grid ?? defaultGrid(role.base_role)
                        }
                        protectedOwner={
                          role.base_role === "owner" ||
                          role.base_role === "owner_doctor"
                        }
                      />
                    ) : (
                      <p role="alert">{en.auth.teamError}</p>
                    )}
                  </>
                );
              })()
            ) : (
              <p role="alert">{en.auth.teamError}</p>
            )}
          </section>
        ))
      ) : (
        <p>{en.auth.empty}</p>
      )}
      <HelpLink helpKey="accounts" />
    </main>
  );
}
