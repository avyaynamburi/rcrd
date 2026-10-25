import Link from "next/link";
import { en } from "@/lib/i18n/en";
export default function Help() {
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="text-2xl font-semibold">{en.helpTitle}</h1>
      <p>{en.helpText}</p>
      <h2 className="text-xl font-semibold">{en.installHelp}</h2>
      <p>{en.installInstructions}</p>
      <p>{en.installUpdateHelp}</p>
      <Link className="underline" href="/">
        {en.home}
      </Link>
    </main>
  );
}
