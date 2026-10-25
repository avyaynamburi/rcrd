"use client";
import { useRef, useState } from "react";
import { saveCenterAccess } from "@/lib/actions/center-access";
import { useConnection } from "@/components/shell/connection-provider";
import { Button } from "@/components/ui/button";
import { en } from "@/lib/i18n/en";
export function CenterAccess({
  id,
  centers,
  initial,
  self,
}: {
  id: string;
  centers: { id: string; name: string }[];
  initial: string[];
  self: boolean;
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
  const t = en.centerAccess;
  return (
    <form
      className="space-y-2 border-t border-border pt-3"
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy.current || self || !online || !centers.length) return;
        busy.current = true;
        setPending(true);
        setMessage("");
        try {
          setMessage(
            (await saveCenterAccess({ membershipId: id, centerIds: selected }))
              .message,
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
        disabled={pending || self || !online || !centers.length}
        className="space-y-2"
      >
        <legend className="font-semibold">{t.title}</legend>
        <p>{t.note}</p>
        {centers.length ? (
          centers.map((center) => (
            <label key={center.id} className="flex min-h-8 items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(center.id)}
                onChange={(event) =>
                  setSelected(
                    event.target.checked
                      ? [...selected, center.id]
                      : selected.filter((id) => id !== center.id),
                  )
                }
              />
              {center.name}
            </label>
          ))
        ) : (
          <p>{t.empty}</p>
        )}
        <Button type="submit">{pending ? t.pending : t.save}</Button>
      </fieldset>
      {self && <p>{t.self}</p>}
      {message && <p role="status">{message}</p>}
    </form>
  );
}
