"use client";
import { useId, useRef, useState } from "react";
import { setPersonDeleted } from "@/lib/actions/deleted-people";
import { useConnection } from "@/components/shell/connection-provider";
import { Button } from "@/components/ui/button";
import { en } from "@/lib/i18n/en";

export function PersonDeletion({
  id,
  label,
  deleted = false,
  self = false,
}: {
  id: string;
  label: string;
  deleted?: boolean;
  self?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  const online = useConnection() === "online";
  const t = en.people;
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        disabled={self || !online || pending}
        onClick={() => {
          setMessage("");
          dialog.current?.showModal();
        }}
      >
        {deleted ? t.restore : t.remove}
      </Button>
      {self && <p>{t.self}</p>}
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          if (busy.current) event.preventDefault();
        }}
        className="m-auto w-[420px] max-w-[calc(100vw-32px)] space-y-4 rounded border border-border bg-background p-6 text-foreground backdrop:bg-black/40"
      >
        <h2 id={titleId} className="text-lg font-semibold">
          {deleted ? t.restore : t.remove}: {label}
        </h2>
        <p id={descriptionId}>{deleted ? t.restoreNote : t.deleteNote}</p>
        {message && <p role="alert">{message}</p>}
        <div className="flex justify-end gap-3">
          <Button
            autoFocus
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => dialog.current?.close()}
          >
            {t.cancel}
          </Button>
          <Button
            type="button"
            disabled={pending || !online}
            onClick={async () => {
              if (busy.current || self || !online) return;
              busy.current = true;
              setPending(true);
              setMessage("");
              try {
                const result = await setPersonDeleted({
                  membershipId: id,
                  deleted: !deleted,
                });
                if (result.success) dialog.current?.close();
                setMessage(result.message);
              } catch {
                setMessage(t.failed);
              } finally {
                busy.current = false;
                setPending(false);
              }
            }}
          >
            {pending ? en.auth.pending : t.confirm}
          </Button>
        </div>
      </dialog>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
