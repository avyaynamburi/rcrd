import { AdvancedSecurity } from "@/components/settings/advanced-security";
import { SecondMenu } from "@/components/shell/second-menu";
import { HelpLink } from "@/components/blocks/help-drawer";
import { en } from "@/lib/i18n/en";
import { getAccount } from "@/lib/auth/session";
import { authConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ClinicSettings() {
  if (authConfigured() && !(await getAccount())?.member.is_owner)
    redirect("/login");
  return (
    <div className="section-workspace">
      <SecondMenu section="settings" selected="Clinic" />
      <main id="main" className="min-w-0 flex-1 space-y-6 px-6 py-10">
        <h1 className="text-2xl font-semibold">
          {en.secondMenu.settings[0].pages[0]}
        </h1>
        <AdvancedSecurity />
        <HelpLink helpKey="advanced-security" />
      </main>
    </div>
  );
}
