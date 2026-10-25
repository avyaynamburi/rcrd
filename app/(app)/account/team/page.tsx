import { redirect } from "next/navigation";
import { z } from "zod";
import { getAccount } from "@/lib/auth/session";
import { AccountAccess } from "@/components/auth/account-access";
import { HelpLink } from "@/components/blocks/help-drawer";
import { en } from "@/lib/i18n/en";

import { MemberRole } from "@/components/auth/member-role";
import { roleSchema, roleTagsSchema } from "@/lib/permissions/roles";

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
  const rolesResult = await account.client.rpc("list_member_roles");
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
            {roles.success &&
            !rolesResult.error &&
            roles.data.find((role) => role.id === person.id) ? (
              (() => {
                const role = roles.data.find((role) => role.id === person.id)!;
                return (
                  <MemberRole
                    id={person.id}
                    initialRole={role.base_role}
                    initialTags={role.role_tags}
                    self={person.id === account.member.id}
                  />
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
