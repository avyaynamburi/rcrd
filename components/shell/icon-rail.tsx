"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  LogOut,
} from "lucide-react";
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
  initials = "—",
}: {
  allowed: readonly NavigationId[];
  version: string;
  unreadCount?: number;
  messagingNeedsSetup?: boolean;
  initials?: string;
}) {
  const pathname = usePathname();
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
  function group(name: "top" | "bottom") {
    return items
      .filter((item) => item.group === name)
      .map((item) => {
        const Icon = icons[item.id];
        const selected = isNavigationActive(pathname, item.href);
        return (
          <Link
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
        <button
          disabled
          className="rail-item"
          title={en.userUnavailable}
          aria-label={en.userUnavailable}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary">
            {initials}
          </span>
          <span>{en.userLabel}</span>
        </button>
        <button
          disabled
          className="rail-item"
          title={en.logoutUnavailable}
          aria-label={en.logoutUnavailable}
        >
          <LogOut size={22} aria-hidden="true" />
          <span>{en.logoutLabel}</span>
        </button>
      </div>
      <span className="py-2 text-center text-xs">v{version}</span>
    </nav>
  );
}
