import Link from "next/link";
import { Button } from "@/components/ui/button";
import { en } from "@/lib/i18n/en";
export default function Home() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-[calc(100dvh-60px)] max-w-3xl flex-col justify-center gap-6 px-6 py-12"
    >
      <h1 className="text-3xl font-semibold">{en.setupTitle}</h1>
      <p className="max-w-xl text-muted-foreground">{en.setupDescription}</p>
      <div>
        <Button asChild variant="outline">
          <Link href="/help/workspace">{en.help}</Link>
        </Button>
      </div>
    </main>
  );
}
