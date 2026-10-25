import { en } from "@/lib/i18n/en";

/** No enabled-looking switch until every advertised protection is enforced. */
export function AdvancedSecurity() {
  const t = en.advancedSecurity;
  return (
    <section
      aria-label={t.general}
      className="space-y-3 rounded border border-border p-4"
    >
      <h2 className="font-semibold">{t.general}</h2>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          disabled
          checked={false}
          readOnly
          aria-describedby="advanced-security-state"
        />
        {t.title}
      </label>
      <details>
        <summary>{t.explainer}</summary>
        <p>{t.description}</p>
      </details>
      <p id="advanced-security-state" role="status">
        {t.unavailable}
      </p>
    </section>
  );
}
