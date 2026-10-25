"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { readOpenGroups } from "@/lib/second-menu";
import { en } from "@/lib/i18n/en";

export type MenuSection = keyof typeof en.secondMenu;
export function SecondMenu({
  section,
  selected,
  userId = "setup-preview",
}: {
  section: MenuSection;
  selected?: string;
  userId?: string;
}) {
  const groups = en.secondMenu[section];
  const storageKey = `rcrd:second-menu:${encodeURIComponent(userId)}:${section}`;
  const [open, setOpen] = useState<string[]>([]);
  useEffect(() => {
    let saved: string[] = [];
    try {
      saved = readOpenGroups(
        localStorage.getItem(storageKey),
        groups.map((group) => group.title),
      );
    } catch {
      /* Storage is optional. */
    }
    // Storage belongs to this browser identity, not the server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(saved);
  }, [storageKey, groups]);
  function toggle(title: string) {
    const next = open.includes(title)
      ? open.filter((id) => id !== title)
      : [...open, title];
    setOpen(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* Keep navigation usable. */
    }
  }
  return (
    <nav aria-label={en.secondMenuLabel} className="second-menu">
      {groups.map((group, index) => (
        <section key={group.title}>
          <h2>
            <button
              type="button"
              aria-expanded={open.includes(group.title)}
              aria-controls={`menu-${section}-${index}`}
              onClick={() => toggle(group.title)}
              className="flex min-h-11 w-full items-center justify-between gap-2 px-4 text-left font-bold text-primary"
            >
              {group.title}
              {open.includes(group.title) ? (
                <ChevronUp size={16} aria-hidden />
              ) : (
                <ChevronDown size={16} aria-hidden />
              )}
            </button>
          </h2>
          <ul
            id={`menu-${section}-${index}`}
            hidden={!open.includes(group.title)}
          >
            {group.pages.map((page) => (
              <li key={page}>
                <Link
                  href={`/${section}?page=${encodeURIComponent(page)}`}
                  aria-current={selected === page ? "page" : undefined}
                  className="second-menu-link"
                >
                  {page}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
