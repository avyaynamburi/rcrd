import Link from "next/link";
import { en } from "@/lib/i18n/en";

export const statusColors = {
  all: "#1E2A4A",
  scheduled: "#8A94A6",
  checked_in: "#D64545",
  engaged: "#E07B39",
  checked_out: "#2E9E5B",
  missed: "#4B5563",
  cancelled: "#C7CCD4",
} as const;

/** No counts are exposed until the authenticated appointment read path exists. */
export function StatusCircles() {
  return (
    <nav aria-label={en.todayStatuses} className="status-circles">
      {Object.entries(statusColors).map(([status, color]) => {
        const label = en.statusLabels[status as keyof typeof statusColors];
        const title = `${label}: ${en.statusUnavailable}`;
        return (
          <Link
            key={status}
            href={`/calendar?todayStatus=${status}#today-panel`}
            title={title}
            aria-label={title}
            className="status-circle"
            style={{ borderColor: color }}
          >
            <span aria-hidden="true">—</span>
          </Link>
        );
      })}
    </nav>
  );
}
