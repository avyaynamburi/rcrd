"use client";

import Link from "next/link";
import { useId, useRef } from "react";
import { en } from "@/lib/i18n/en";

/** Data-free preview. Authenticated identity and center changes belong to ACC-02/08. */
export function UserMenu() {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  return (
    <>
      <button
        type="button"
        className="rail-item"
        popoverTarget={id}
        aria-label={en.userMenu}
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary"
          aria-hidden="true"
        >
          —
        </span>
        <span>{en.userLabel}</span>
      </button>
      <div
        ref={panel}
        id={id}
        popover="auto"
        className="user-popover"
        aria-label={en.userMenu}
      >
        <h2 className="font-semibold text-primary">{en.userMenu}</h2>
        <dl className="mt-3 space-y-2">
          <div>
            <dt className="text-muted-foreground">{en.userName}</dt>
            <dd>{en.userNotSignedIn}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{en.userRole}</dt>
            <dd>{en.userNotAssigned}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{en.userCenter}</dt>
            <dd>{en.userNotAssigned}</dd>
          </div>
        </dl>
        <p id={`${id}-notice`} className="mt-3">
          {en.userSetupNotice}
        </p>
        <div className="my-3 flex flex-col gap-2">
          <button
            type="button"
            disabled
            aria-describedby={`${id}-notice`}
            className="rounded border border-border p-2 text-left text-muted-foreground disabled:cursor-not-allowed"
          >
            {en.userChangePassword}
          </button>
          <button
            type="button"
            disabled
            aria-describedby={`${id}-notice`}
            className="rounded border border-border p-2 text-left text-muted-foreground disabled:cursor-not-allowed"
          >
            {en.userSwitchCenter}
          </button>
        </div>
        <Link
          href="/help/user-menu"
          className="underline"
          onClick={() => panel.current?.hidePopover()}
        >
          {en.help}
        </Link>
        <button
          type="button"
          popoverTarget={id}
          popoverTargetAction="hide"
          className="ml-4 underline"
        >
          {en.userClose}
        </button>
      </div>
    </>
  );
}
