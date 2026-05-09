import { ROLES } from "@/shared/config/roles";
import type { AppRole } from "@/shared/config/roles";

import { ADMIN_SIDEBAR } from "./admin-sidebar";
import { EMPLOYEE_SIDEBAR } from "./employee-sidebar";
import { resolveSettingsPageTitle } from "./settings-route-titles";
import type { AppNavItem } from "./types";

export type { AppNavItem, RoleNavDefinition } from "./types";
export { ADMIN_SIDEBAR } from "./admin-sidebar";
export { EMPLOYEE_SIDEBAR } from "./employee-sidebar";

const BY_ROLE: Record<AppRole, AppNavItem[]> = {
  [ROLES.ADMIN]: ADMIN_SIDEBAR.items,
  [ROLES.EMPLOYEE]: EMPLOYEE_SIDEBAR.items,
};

export function getSidebarItemsForRole(role: AppRole): AppNavItem[] {
  return BY_ROLE[role] ?? EMPLOYEE_SIDEBAR.items;
}

type TitleMatch = { pattern: string; title: string };

function buildTitleIndex(items: AppNavItem[]): TitleMatch[] {
  const matches: TitleMatch[] = [];
  for (const item of items) {
    const title = item.pageTitle ?? item.label;
    const patterns = [
      item.href,
      ...(item.matchPaths ?? []),
    ].sort((a, b) => b.length - a.length);
    for (const pattern of patterns) {
      matches.push({ pattern, title });
    }
  }
  return matches.sort((a, b) => b.pattern.length - a.pattern.length);
}

export function resolvePageTitle(pathname: string, role: AppRole): string {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  const settingsTitle = resolveSettingsPageTitle(pathname);
  if (settingsTitle) {
    return settingsTitle;
  }

  const items = getSidebarItemsForRole(role);

  for (const { pattern, title } of buildTitleIndex(items)) {
    if (normalized === pattern || normalized.startsWith(`${pattern}/`)) {
      return title;
    }
  }

  return role === ROLES.ADMIN ? "Admin" : "My Workspace";
}
