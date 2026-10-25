import Link from "next/link";
import { en } from "@/lib/i18n/en";

export default function AssistantHelp() {
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="text-2xl font-semibold">{en.assistantTitle}</h1>
      <p>{en.assistantHelp}</p>
      <p>{en.assistantUnavailable}</p>
      <Link href="/" className="underline">
        {en.home}
      </Link>
    </main>
  );
}
