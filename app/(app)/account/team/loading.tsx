import { en } from "@/lib/i18n/en";
export default function LoadingTeam() {
  return (
    <main
      id="main"
      className="mx-auto max-w-3xl space-y-5 px-6 py-10"
      aria-busy="true"
    >
      <h1 className="text-2xl font-semibold">{en.auth.team}</h1>
      <p role="status">{en.accessGrid.loading}</p>
    </main>
  );
}
