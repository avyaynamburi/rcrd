import { SecondMenu, type MenuSection } from "@/components/shell/second-menu";
import { HelpLink } from "@/components/blocks/help-drawer";
import { notFound } from "next/navigation";
import { en } from "@/lib/i18n/en";
import { navigationItems } from "@/lib/shell-navigation";

export default async function Section({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ todayStatus?: string; page?: string }>;
}) {
  const { section } = await params;
  const item = navigationItems.find((item) => item.href === `/${section}`);
  if (!item) notFound();
  const { todayStatus, page } = await searchParams;
  const status =
    todayStatus && Object.hasOwn(en.statusLabels, todayStatus)
      ? en.statusLabels[todayStatus as keyof typeof en.statusLabels]
      : en.statusLabels.all;
  const menuSection = Object.hasOwn(en.secondMenu, section)
    ? (section as MenuSection)
    : undefined;
  const selected =
    menuSection &&
    en.secondMenu[menuSection].some((group) =>
      group.pages.some((name) => name === page),
    )
      ? page
      : undefined;
  return (
    <div className="section-workspace">
      {menuSection && (
        <SecondMenu
          key={menuSection}
          section={menuSection}
          selected={selected}
        />
      )}
      <main id="main" className="min-w-0 flex-1 space-y-6 px-6 py-12">
        <h1 className="text-2xl font-semibold">
          {selected ?? en.navigation[item.id]}
        </h1>
        <p>{en.featureUnavailable}</p>
        {section === "calendar" && (
          <section id="today-panel" aria-label={en.todayFilter}>
            <h2>
              {en.todayFilter}: {status}
            </h2>
            <p>{en.statusUnavailable}</p>
          </section>
        )}
        <HelpLink
          helpKey="screen-preview"
          title={selected ?? en.navigation[item.id]}
        />
      </main>
    </div>
  );
}
