import Link from "next/link";
import { getAccount } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { formatAuditTime } from "@/lib/audit/filters";
import { readAudit } from "@/lib/audit/read";
import { en } from "@/lib/i18n/en";
import { HelpLink } from "@/components/blocks/help-drawer";
export default async function AccessAudit({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const account = await getAccount();
  if (!account?.member.is_owner) redirect("/login");
  const input = await searchParams;
  let result;
  try {
    result = await readAudit(input);
  } catch {
    /* fail closed */
  }
  const params = new URLSearchParams(
    Object.entries(input).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
  function pageLink(page: number) {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    return `?${next}`;
  }
  return (
    <main id="main" className="space-y-5 p-6 min-w-0">
      <h1 className="text-2xl font-semibold">{en.audit.title}</h1>
      <p>{en.audit.description}</p>
      <form key={params.toString()} className="flex flex-wrap gap-3">
        {(["from", "to", "user", "center", "area", "action"] as const).map(
          (key) => (
            <label key={key} className="flex flex-col gap-1">
              {en.audit[key]}
              <input
                className="rounded border border-border p-2"
                name={key}
                type={key === "from" || key === "to" ? "date" : "text"}
                defaultValue={typeof input[key] === "string" ? input[key] : ""}
              />
            </label>
          ),
        )}
        <button className="rounded bg-primary px-4 py-2 text-white">
          {en.audit.filter}
        </button>
        <Link href="/admin/access-audit">{en.audit.reset}</Link>
      </form>
      {!result ? (
        <p role="alert">{en.audit.error}</p>
      ) : (
        <>
          <div className="flex gap-4">
            <a href={`/api/access-audit?${params}&format=xlsx`}>
              {en.audit.excel}
            </a>
            <a href={`/api/access-audit?${params}&format=pdf`}>
              {en.audit.pdf}
            </a>
          </div>
          <p>{en.audit.pageSize}</p>
          {!result.rows.length ? (
            <p role="status">{en.audit.empty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <caption className="sr-only">{en.audit.title}</caption>
                <thead>
                  <tr>
                    {[
                      en.audit.time,
                      en.audit.user,
                      en.audit.center,
                      en.audit.area,
                      en.audit.action,
                      en.audit.source,
                      en.audit.values,
                    ].map((label) => (
                      <th className="border-b p-2" key={label}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr key={row.id}>
                      <td className="border-b p-2 whitespace-nowrap">
                        {formatAuditTime(row.created_at)}
                      </td>
                      <td className="border-b p-2">{row.actor_id}</td>
                      <td className="border-b p-2">
                        {row.center_id ?? en.audit.organization}
                      </td>
                      <td className="border-b p-2">{row.area}</td>
                      <td className="border-b p-2">{row.action}</td>
                      <td className="border-b p-2">
                        {row.source === "ai" ? en.audit.viaAI : row.source}
                      </td>
                      <td className="border-b p-2">
                        <details>
                          <summary>{en.audit.values}</summary>
                          <p>
                            {en.audit.record}: {row.record_id}
                          </p>
                          <pre className="max-w-lg whitespace-pre-wrap break-all">
                            {JSON.stringify(
                              {
                                before: row.before_data,
                                after: row.after_data,
                              },
                              null,
                              2,
                            )}
                          </pre>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <nav aria-label={en.audit.pagination} className="flex gap-4">
            {result.page > 1 && (
              <Link href={pageLink(result.page - 1)}>{en.audit.previous}</Link>
            )}
            {result.page * 50 < result.count && (
              <Link href={pageLink(result.page + 1)}>{en.audit.next}</Link>
            )}
          </nav>
        </>
      )}
      <HelpLink helpKey="access-audit" />
    </main>
  );
}
