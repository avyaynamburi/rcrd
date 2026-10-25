"use client";

import { useRef, useState } from "react";
import { useToast } from "@/components/blocks/toast-provider";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { en } from "@/lib/i18n/en";

export function LogoutConfirmation() {
  const notify = useToast();
  const dialog = useRef<HTMLDialogElement>(null);
  const [unavailable, setUnavailable] = useState(false);
  return (
    <>
      <button
        type="button"
        className="rail-item"
        onClick={() => {
          setUnavailable(false);
          dialog.current?.showModal();
        }}
      >
        <LogOut size={22} aria-hidden="true" />
        <span>{en.logoutLabel}</span>
      </button>
      <dialog
        ref={dialog}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const buttons =
            event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        aria-labelledby="logout-title"
        aria-describedby="logout-question"
        className="m-auto w-[360px] max-w-[calc(100vw-32px)] rounded-md border border-border bg-background p-6 text-foreground backdrop:bg-black/40"
      >
        <h2 id="logout-title" className="text-lg font-semibold text-primary">
          {en.appName}
        </h2>
        <p id="logout-question" className="mt-3">
          {en.logoutQuestion}
        </p>
        {unavailable && (
          <p role="alert" className="mt-3">
            {en.logoutUnavailable}
          </p>
        )}
        <form method="dialog" className="mt-6 flex justify-end gap-3">
          <Button
            autoFocus
            type="button"
            variant="outline"
            onClick={() => dialog.current?.close()}
          >
            {en.no}
          </Button>
          <Button
            type="button"
            onClick={() => {
              setUnavailable(true);
              notify({ kind: "error", message: en.logoutUnavailable });
            }}
          >
            {en.yes}
          </Button>
        </form>
      </dialog>
    </>
  );
}
