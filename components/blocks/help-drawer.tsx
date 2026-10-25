"use client";

import { createContext, useContext, useId, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { HelpArticles, HelpKey } from "@/lib/help";
import { en } from "@/lib/i18n/en";

const HelpContext = createContext<(key: HelpKey, title?: string) => void>(
  () => {},
);

export function HelpProvider({
  articles,
  children,
}: {
  articles: HelpArticles;
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const id = useId();
  const [selection, setSelection] = useState<{ key: HelpKey; title?: string }>({
    key: "workspace",
  });
  const article = articles[selection.key];
  return (
    <HelpContext.Provider
      value={(key, title) => {
        returnFocus.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        setSelection({ key, title });
        dialog.current?.showModal();
      }}
    >
      {children}
      <dialog
        ref={dialog}
        aria-labelledby={id}
        className="assistant-panel backdrop:bg-black/20"
        onClose={() => returnFocus.current?.focus()}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const targets = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              "button:not(:disabled), a[href]",
            ),
          );
          const first = targets[0];
          const last = targets.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id={id} className="text-lg font-semibold text-primary">
            {selection.title ?? article?.title ?? en.helpTitle}
          </h2>
          <button
            autoFocus
            type="button"
            aria-label={en.helpClose}
            className="p-3"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} aria-hidden />
          </button>
        </div>
        <article className="mt-6 space-y-4">
          {article ? (
            article.paragraphs.map((paragraph, index) => {
              if (paragraph.startsWith("## "))
                return (
                  <h3 key={index} className="text-lg font-semibold">
                    {paragraph.slice(3)}
                  </h3>
                );
              return (
                <p key={index} className="whitespace-pre-line">
                  {paragraph
                    .split(/(\*\*.*?\*\*|\[.*?\]\(\/help\/[a-z-]+\))/g)
                    .map((part, partIndex) => {
                      if (part.startsWith("**"))
                        return (
                          <strong key={partIndex}>{part.slice(2, -2)}</strong>
                        );
                      const link = part.match(
                        /^\[(.*?)\]\((\/help\/[a-z-]+)\)$/,
                      );
                      return link ? (
                        <Link
                          key={partIndex}
                          href={link[2]}
                          className="underline"
                          onClick={() => dialog.current?.close()}
                        >
                          {link[1]}
                        </Link>
                      ) : (
                        part
                      );
                    })}
                </p>
              );
            })
          ) : (
            <p role="alert">{en.helpUnavailable}</p>
          )}
        </article>
      </dialog>
    </HelpContext.Provider>
  );
}

export function HelpLink({
  helpKey,
  title,
}: {
  helpKey: HelpKey;
  title?: string;
}) {
  const open = useContext(HelpContext);
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className="mt-6 block text-left text-[#a34d16] underline"
      onClick={() => open(helpKey, title)}
    >
      {en.help}
    </button>
  );
}
