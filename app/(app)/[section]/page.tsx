import Link from "next/link";
import { notFound } from "next/navigation";
import { en } from "@/lib/i18n/en";
import { navigationItems } from "@/lib/shell-navigation";

export default async function Section({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const item = navigationItems.find((item) => item.href === `/${section}`);
  if (!item) notFound();
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="text-2xl font-semibold">{en.navigation[item.id]}</h1>
      <p>{en.featureUnavailable}</p>
      <Link href="/help/workspace" className="underline">
        {en.help}
      </Link>
    </main>
  );
}
