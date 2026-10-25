"use client";
import { useEffect, useState } from "react";
import { en } from "@/lib/i18n/en";
import { formatClinicTime } from "@/lib/clinic-time";

export function ClinicClock({
  timeZone = "Asia/Kolkata",
}: {
  timeZone?: string;
}) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    let timer: number;
    const update = () => {
      setNow(new Date());
      timer = window.setTimeout(update, 60_000 - (Date.now() % 60_000));
    };
    update();
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <time
      className="clinic-clock"
      aria-label={en.clockLabel}
      dateTime={now?.toISOString()}
      title={timeZone}
    >
      {now ? formatClinicTime(now, timeZone) : "—"}
    </time>
  );
}
