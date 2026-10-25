"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Mic, X } from "lucide-react";
import { en } from "@/lib/i18n/en";

export function AssistantLauncher({
  userId = "setup-preview",
}: {
  userId?: string;
}) {
  const key = `rcrd:assistant-greeting:${encodeURIComponent(userId)}`;
  const [dismissed, setDismissed] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    let hidden = false;
    try {
      hidden = localStorage.getItem(key) === "dismissed";
    } catch {
      /* Optional preference. */
    }
    // Load browser-only preferences after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissed(hidden);
  }, [key]);
  return (
    <>
      <div className="assistant-launcher">
        {!dismissed && (
          <div className="assistant-greeting">
            <p>{en.assistantGreeting}</p>
            <button
              type="button"
              aria-label={en.assistantDismiss}
              className="p-2 text-destructive"
              onClick={() => {
                setDismissed(true);
                try {
                  localStorage.setItem(key, "dismissed");
                } catch {
                  /* Keep dismissal usable. */
                }
              }}
            >
              <X size={16} aria-hidden />
            </button>
          </div>
        )}
        <button
          type="button"
          className="assistant-trigger"
          aria-label={en.assistantOpen}
          aria-haspopup="dialog"
          onClick={() => dialog.current?.showModal()}
        >
          <MessageCircle aria-hidden />
        </button>
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="assistant-title"
        aria-describedby="assistant-unavailable"
        className="assistant-panel backdrop:bg-black/20"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="assistant-title" className="text-lg font-semibold">
            {en.assistantTitle}
          </h2>
          <button
            autoFocus
            type="button"
            className="p-3"
            aria-label={en.assistantClose}
            onClick={() => dialog.current?.close()}
          >
            <X size={20} aria-hidden />
          </button>
        </div>
        <p id="assistant-unavailable" className="my-6">
          {en.assistantUnavailable}
        </p>
        <label htmlFor="assistant-message">{en.assistantMessage}</label>
        <textarea
          id="assistant-message"
          disabled
          className="my-2 w-full rounded border border-border p-2"
        />
        <div className="flex gap-3">
          <button
            type="button"
            disabled
            className="flex items-center gap-2 rounded border border-border p-2"
          >
            <Mic size={16} aria-hidden />
            {en.assistantVoice}
          </button>
          <button
            type="button"
            disabled
            className="rounded border border-border p-2"
          >
            {en.assistantSend}
          </button>
        </div>
        <Link
          href="/help/assistant"
          className="mt-6 inline-block text-[#a34d16] underline"
          onClick={() => dialog.current?.close()}
        >
          {en.help}
        </Link>
      </dialog>
    </>
  );
}
