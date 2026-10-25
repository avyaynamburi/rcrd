"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useId, useRef } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  List,
  ContactRound,
  Handshake,
  Lightbulb,
  Bell,
  MessageCircle,
  Settings,
  Ellipsis,
} from "lucide-react";
import { UserMenu } from "@/components/shell/user-menu";
import { LogoutConfirmation } from "@/components/shell/logout-confirmation";
import { en } from "@/lib/i18n/en";
import {
  isNavigationActive,
  visibleNavigation,
  type NavigationId,
} from "@/lib/shell-navigation";

const icons = {
  dashboard: LayoutDashboard,
  calendar: CalendarDays,
  patients: UserRound,
  reports: List,
  admin: ContactRound,
  crm: Handshake,
  help: Lightbulb,
  notifications: Bell,
  whatsapp: MessageCircle,
  settings: Settings,
};

export function IconRail({
  allowed,
  version,
  unreadCount = 0,
  messagingNeedsSetup = false,
}: {
  allowed: readonly NavigationId[];
  version: string;
  unreadCount?: number;
  messagingNeedsSetup?: boolean;
}) {
  const pathname = usePathname();
  const moreId = useId();
  const morePanel = useRef<HTMLDivElement>(null);
  const [connection, setConnection] = useState<
    "checking" | "online" | "offline"
  >("checking");
  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    async function check() {
      controller?.abort();
      const current = new AbortController();
      controller = current;
      try {
        const response = await fetch("/api/health", {
          cache: "no-store",
          signal: AbortSignal.any([current.signal, AbortSignal.timeout(5000)]),
        });
        if (active && !current.signal.aborted)
          setConnection(response.ok ? "online" : "offline");
      } catch {
        if (active && !current.signal.aborted) setConnection("offline");
      }
    }
    function offline() {
      controller?.abort();
      setConnection("offline");
    }
    void check();
    const interval = setInterval(() => void check(), 30000);
    window.addEventListener("online", check);
    window.addEventListener("offline", offline);
    return () => {
      active = false;
      controller?.abort();
      clearInterval(interval);
      window.removeEventListener("online", check);
      window.removeEventListener("offline", offline);
    };
  }, []);
  const status = {
    checking: en.connectionChecking,
    online: en.connectionOnline,
    offline: en.connectionOffline,
  }[connection];
  const items = visibleNavigation(allowed);
  function group(name: "top" | "bottom" | "main" | "more") {
    return items
      .filter((item) => {
        const main = ["dashboard", "calendar", "patients"].includes(item.id);
        return name === "main"
          ? main
          : name === "more"
            ? !main
            : item.group === name;
      })
      .map((item) => {
        const Icon = icons[item.id];
        const selected = isNavigationActive(pathname, item.href);
        return (
          <Link
            onClick={() => morePanel.current?.hidePopover()}
            key={item.id}
            href={item.href}
            aria-current={selected ? "page" : undefined}
            className="rail-item"
            title={en.navigation[item.id]}
          >
            <Icon
              aria-hidden="true"
              size={22}
              className={selected ? "text-accent" : ""}
            />
            <span>{en.navigation[item.id]}</span>
            {item.id === "notifications" && unreadCount > 0 && (
              <span className="rail-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            {item.id === "whatsapp" && messagingNeedsSetup && (
              <span className="rail-badge" title={en.messagingSetup}>
                {en.newTag}
              </span>
            )}
          </Link>
        );
      });
  }
  return (
    <>
      <nav aria-label={en.navigationLabel} className="icon-rail">
        <span
          role="status"
          aria-label={status}
          title={status}
          className={`connection-dot connection-${connection}`}
        />
        <div>{group("top")}</div>
        <div className="mt-auto pt-6">
          {group("bottom")}
          <UserMenu />
          <LogoutConfirmation />
        </div>
        <span className="py-2 text-center text-xs">v{version}</span>
      </nav>
      <nav aria-label={en.mobileNavigation} className="mobile-navigation">
        {group("main")}
        <button type="button" className="rail-item" popoverTarget={moreId}>
          <Ellipsis size={22} aria-hidden />
          <span>{en.moreNavigation}</span>
        </button>
        <div
          ref={morePanel}
          id={moreId}
          popover="auto"
          className="mobile-more"
          aria-label={en.moreNavigation}
        >
          <h2 className="px-3 py-2 font-semibold">{en.moreNavigation}</h2>
          <div className="mobile-more-items">
            {group("more")}
            <UserMenu />
            <LogoutConfirmation />
          </div>
          <p className="px-3 py-2 text-xs">
            {status} · v{version}
          </p>
          <button
            className="m-3 rounded border border-border p-2"
            popoverTarget={moreId}
            popoverTargetAction="hide"
          >
            {en.closeNavigation}
          </button>
        </div>
      </nav>
    </>
  );
}
