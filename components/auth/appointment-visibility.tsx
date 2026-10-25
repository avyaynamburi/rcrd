"use client";
import { useRef, useState } from "react";
import { saveAppointmentVisibility } from "@/lib/actions/appointment-visibility";
import { useConnection } from "@/components/shell/connection-provider";
import { Button } from "@/components/ui/button";
import { en } from "@/lib/i18n/en";
export function AppointmentVisibility({
  id,
  initial,
  protectedOwner,
}: {
  id: string;
  initial: "all" | "own";
  protectedOwner: boolean;
}) {
  const version = JSON.stringify([id, initial]);
  const [previous, setPrevious] = useState(version);
  const [selected, setSelected] = useState(initial);
  if (previous !== version) {
    setPrevious(version);
    setSelected(initial);
  }
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  const online = useConnection() === "online";
  const t = en.appointmentVisibility;
  return (
    <form
      className="space-y-2 border-t border-border pt-3"
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy.current || protectedOwner || !online) return;
        busy.current = true;
        setPending(true);
        setMessage("");
        try {
          setMessage(
            (
              await saveAppointmentVisibility({
                membershipId: id,
                visibility: selected,
              })
            ).message,
          );
        } catch {
          setMessage(t.failed);
        } finally {
          busy.current = false;
          setPending(false);
        }
      }}
    >
      <fieldset
        disabled={pending || protectedOwner || !online}
        className="space-y-2"
      >
        <legend className="font-semibold">{t.title}</legend>
        <p>{t.note}</p>
        <label className="flex items-center gap-2">
          {t.title}
          <select
            aria-label={t.title}
            value={selected}
            className="rounded border border-border bg-white p-2"
            onChange={(event) =>
              setSelected(event.target.value as "all" | "own")
            }
          >
            <option value="all">{t.all}</option>
            <option value="own">{t.own}</option>
          </select>
        </label>
        <Button type="submit">{pending ? t.pending : t.save}</Button>
      </fieldset>
      {protectedOwner && <p>{t.protected}</p>}
      {message && <p role="status">{message}</p>}
    </form>
  );
}
