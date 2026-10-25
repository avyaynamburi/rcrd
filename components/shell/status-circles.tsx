import Link from "next/link";
import { en } from "@/lib/i18n/en";

export const statusColors = {
  all: "var(--primary)",
  scheduled: "var(--status-scheduled)",
  checked_in: "var(--status-in)",
  engaged: "var(--status-engaged)",
  checked_out: "var(--status-out)",
  missed: "var(--status-missed)",
  cancelled: "var(--status-cancelled)",
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
