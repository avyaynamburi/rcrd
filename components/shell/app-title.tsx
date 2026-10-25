import Image from "next/image";
import Link from "next/link";
import { en } from "@/lib/i18n/en";

export function AppTitle() {
  return (
    <header className="flex h-[60px] items-center border-b border-border px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-3 text-xl font-semibold text-primary"
        aria-label={en.appName}
      >
        <Image
          src="/icons/icon-192.png"
          width={32}
          height={32}
          alt=""
          priority
        />
        <span>{en.appName}</span>
      </Link>
    </header>
  );
}
