import { en } from "@/lib/i18n/en";
export default function Loading() {
  return (
    <main id="main" className="p-6" role="status">
      {en.auth.pending}
    </main>
  );
}
