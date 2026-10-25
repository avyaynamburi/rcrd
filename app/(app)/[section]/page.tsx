import Link from "next/link";
import { notFound } from "next/navigation";
import { en } from "@/lib/i18n/en";
import { navigationItems } from "@/lib/shell-navigation";

export default async function Section({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ todayStatus?: string }>;
}) {
  const { section } = await params;
  const item = navigationItems.find((item) => item.href === `/${section}`);
  if (!item) notFound();
  const { todayStatus } = await searchParams;
  const status =
    todayStatus && Object.hasOwn(en.statusLabels, todayStatus)
      ? en.statusLabels[todayStatus as keyof typeof en.statusLabels]
      : en.statusLabels.all;
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="text-2xl font-semibold">{en.navigation[item.id]}</h1>
      <p>{en.featureUnavailable}</p>
      {section === "calendar" && (
        <section id="today-panel" aria-label={en.todayFilter}>
          <h2>
            {en.todayFilter}: {status}
          </h2>
          <p>{en.statusUnavailable}</p>
        </section>
      )}
      <Link href="/help/workspace" className="underline">
        {en.help}
      </Link>
    </main>
  );
}
