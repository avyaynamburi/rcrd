import { recordAuditExport } from "@/lib/actions/access-audit";
import { formatAuditTime } from "@/lib/audit/filters";
import { readAudit } from "@/lib/audit/read";
import ExcelJS from "exceljs";
import { createElement as h } from "react";
import { Document, Page, Text, renderToBuffer } from "@react-pdf/renderer";
import { en } from "@/lib/i18n/en";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const params = Object.fromEntries(new URL(request.url).searchParams);
    if (!["xlsx", "pdf"].includes(params.format))
      return new Response(null, { status: 400 });
    const { rows, page } = await readAudit(params, true);
    await recordAuditExport({ format: params.format, page });
    const headers = {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="access-audit.${params.format}"`,
    };
    if (params.format === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet(en.audit.title);
      sheet.addRow([
        en.audit.time,
        en.audit.user,
        en.audit.center,
        en.audit.area,
        en.audit.action,
        en.audit.source,
        en.audit.record,
        en.audit.values,
      ]);
      for (const row of rows)
        sheet.addRow([
          formatAuditTime(row.created_at),
          row.actor_id,
          row.center_id,
          row.area,
          row.action,
          row.source,
          row.record_id,
          JSON.stringify({ before: row.before_data, after: row.after_data }),
        ]);
      return new Response(new Uint8Array(await workbook.xlsx.writeBuffer()), {
        headers: {
          ...headers,
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
    }
    const document = h(
      Document,
      {},
      h(
        Page,
        { size: "A4", style: { padding: 24, fontSize: 9 } },
        h(Text, { style: { fontSize: 16, marginBottom: 12 } }, en.audit.title),
        ...rows.map((row) =>
          h(
            Text,
            { key: row.id, style: { marginBottom: 12 } },
            `${formatAuditTime(row.created_at)} | ${row.actor_id} | ${row.center_id ?? en.audit.organization}\n${row.area} | ${row.action} | ${row.source} | ${row.record_id}\n${JSON.stringify({ before: row.before_data, after: row.after_data })}`,
          ),
        ),
      ),
    );
    return new Response(new Uint8Array(await renderToBuffer(document)), {
      headers: { ...headers, "Content-Type": "application/pdf" },
    });
  } catch {
    return new Response(null, {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
