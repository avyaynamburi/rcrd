import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { en } from "@/lib/i18n/en";

/** Supply the organisation name from trusted session context once sign-in exists. */
export function AppTitle({
  organisationName,
  backHref,
  controls,
}: {
  organisationName?: string;
  backHref?: string;
  controls?: ReactNode;
}) {
  return (
    <header
      aria-label={en.topBarLabel}
      className="flex h-[60px] min-w-0 items-center gap-3 border-b border-border bg-background px-5"
    >
      {backHref && (
        <Link
          href={backHref}
          aria-label={en.back}
          className="inline-flex size-8 shrink-0 items-center justify-center text-primary"
        >
          <ArrowLeft aria-hidden="true" size={20} />
        </Link>
      )}
      <span
        className="min-w-0 truncate font-semibold text-primary uppercase"
        title={organisationName?.trim() || en.clinicNotConfigured}
      >
        {organisationName?.trim() || en.clinicNotConfigured}
      </span>
      <div className="ml-auto flex shrink-0 items-center gap-3">{controls}</div>
    </header>
  );
}
