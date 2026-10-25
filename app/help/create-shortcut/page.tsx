import Link from "next/link";
import { en } from "@/lib/i18n/en";

export default function ShortcutHelp() {
  return (
    <main id="main" className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <h1 className="text-2xl font-semibold">{en.shortcutTitle}</h1>
      <p>{en.shortcutIntro}</p>
      <h2 className="text-xl font-semibold">{en.shortcutChrome}</h2>
      <p>{en.shortcutChromeSteps}</p>
      <h2 className="text-xl font-semibold">{en.shortcutEdge}</h2>
      <p>{en.shortcutEdgeSteps}</p>
      <p>{en.shortcutWindow}</p>
      <h2 className="text-xl font-semibold">{en.shortcutMissingTitle}</h2>
      <p>{en.shortcutMissing}</p>
      <p>{en.installUpdateHelp}</p>
      <Link className="underline" href="/">
        {en.home}
      </Link>
    </main>
  );
}
