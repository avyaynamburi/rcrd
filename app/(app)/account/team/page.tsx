import { DeletedPeople } from "@/components/auth/deleted-people";
import { PersonDeletion } from "@/components/auth/person-deletion";
import { deletedPeopleSchema } from "@/lib/permissions/deleted-people";
import { RecordStampMenu } from "@/components/blocks/record-stamps";
import Link from "next/link";
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
  const stampsResult = await account.client.rpc("list_member_stamps");
  const stampRows = z
    .array(
      z.object({
        id: z.uuid(),
        created_by: z.string().nullable(),
        created_at: z.string(),
        updated_by: z.string().nullable(),
        updated_at: z.string(),
      }),
    )
    .safeParse(stampsResult.data);
  const deletedResult = await account.client.rpc("list_deleted_people");
  const deletedPeople = deletedPeopleSchema.safeParse(deletedResult.data);
  const users = {};
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-5 px-6 py-10">
      <h1 className="text-2xl font-semibold">{en.auth.team}</h1>
      <Link href="/admin/access-audit">{en.audit.title}</Link>
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
            {(() => {
              const stamps = (stampRows.success ? stampRows.data : []).find(
                (row) => row.id === person.id,
              );
              return !stampsResult.error && stamps ? (
                <RecordStampMenu stamps={stamps} users={users} />
              ) : (
                <p role="alert">{en.stamps.unavailable}</p>
              );
            })()}
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
                    {(role.base_role === "doctor" ||
                      role.base_role === "owner_doctor") && (
                      <section className="space-y-2 border-t border-border pt-3">
                        <label>
                          <input
                            type="checkbox"
                            disabled
                            checked={false}
                            readOnly
                          />{" "}
                          {en.summaryNotification.title}
                        </label>
                        <p role="status">
                          {en.summaryNotification.unavailable}
                        </p>
                      </section>
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
            <PersonDeletion
              id={person.id}
              label={person.email ?? en.auth.account}
              self={person.id === account.member.id}
            />
          </section>
        ))
      ) : (
        <p>{en.auth.empty}</p>
      )}
      <DeletedPeople
        people={deletedPeople.success ? deletedPeople.data : []}
        failed={Boolean(deletedResult.error) || !deletedPeople.success}
      />
      <HelpLink helpKey="accounts" />
    </main>
  );
}
