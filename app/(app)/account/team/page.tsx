import { redirect } from "next/navigation";
import { z } from "zod";
import { getAccount } from "@/lib/auth/session";
import { AccountAccess } from "@/components/auth/account-access";
import { HelpLink } from "@/components/blocks/help-drawer";
import { en } from "@/lib/i18n/en";

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
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-5 px-6 py-10">
      <h1 className="text-2xl font-semibold">{en.auth.team}</h1>
      <p>{en.auth.mobileLimit}</p>
      {error || !accounts.success ? (
        <p role="alert">{en.auth.teamError}</p>
      ) : accounts.data.length ? (
        accounts.data.map((person) => (
          <AccountAccess
            key={person.id}
            account={person}
            self={person.id === account.member.id}
          />
        ))
      ) : (
        <p>{en.auth.empty}</p>
      )}
      <HelpLink helpKey="accounts" />
    </main>
  );
}
