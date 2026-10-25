import { Ellipsis } from "lucide-react";
import { en } from "@/lib/i18n/en";
import { stampDate, stampUser, type RecordStamps } from "@/lib/records/stamps";

export function RecordStampMenu({
  stamps,
  users,
  timeZone = "Asia/Kolkata",
}: {
  stamps: RecordStamps;
  users: Record<string, string>;
  timeZone?: string;
}) {
  return (
    <details className="relative">
      <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-2 rounded border border-border px-3 focus-visible:outline-2 focus-visible:outline-navy">
        <Ellipsis size={18} aria-hidden />
        {en.stamps.menu}
      </summary>
      <div
        className="mt-2 space-y-1 rounded border border-warning bg-[#FFF7DB] p-3 text-text"
        role="note"
      >
        <p>
          {en.stamps.created}: {stampUser(stamps.created_by, users)}{" "}
          {en.stamps.on}{" "}
          <time dateTime={stamps.created_at}>
            {stampDate(stamps.created_at, timeZone)}
          </time>
        </p>
        <p>
          {en.stamps.updated}: {stampUser(stamps.updated_by, users)}{" "}
          {en.stamps.on}{" "}
          <time dateTime={stamps.updated_at}>
            {stampDate(stamps.updated_at, timeZone)}
          </time>
        </p>
      </div>
    </details>
  );
}
