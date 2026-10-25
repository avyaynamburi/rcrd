export const navigationItems = [
  { id: "dashboard", href: "/dashboard", group: "top" },
  { id: "calendar", href: "/calendar", group: "top" },
  { id: "patients", href: "/patients", group: "top" },
  { id: "reports", href: "/reports", group: "top" },
  { id: "admin", href: "/admin", group: "top" },
  { id: "crm", href: "/crm", group: "top" },
  { id: "help", href: "/help/workspace", group: "top" },
  { id: "notifications", href: "/notifications", group: "bottom" },
  { id: "whatsapp", href: "/whatsapp", group: "bottom" },
  { id: "settings", href: "/settings", group: "bottom" },
] as const;
export type NavigationId = (typeof navigationItems)[number]["id"];

export function visibleNavigation(allowed: readonly NavigationId[]) {
  return navigationItems.filter((item) => allowed.includes(item.id));
}
export function isNavigationActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
