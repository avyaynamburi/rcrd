import { en } from "@/lib/i18n/en";
export default function Loading() {
  return (
    <main id="main" aria-busy="true" className="p-6">
      <p role="status">{en.audit.loading}</p>
    </main>
  );
}
