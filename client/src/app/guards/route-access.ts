import type { AppRole } from "@/shared/config/roles";
import { ROLES } from "@/shared/config/roles";

type AccessRule = {
  /** More specific rules should appear first (longer path prefixes). */
  pathPrefix: string;
  allow: AppRole[];
};

/**
 * Declarative route ACL for authenticated dashboard routes.
 * Paths not covered here remain accessible to any authenticated user.
 */
const DASHBOARD_ROUTE_RULES: AccessRule[] = [
  { pathPrefix: "/employees", allow: [ROLES.ADMIN] },
  { pathPrefix: "/leaves/approvals", allow: [ROLES.ADMIN] },
  { pathPrefix: "/leaves/analytics", allow: [ROLES.ADMIN] },
  { pathPrefix: "/leaves/apply", allow: [ROLES.EMPLOYEE] },
  { pathPrefix: "/reports", allow: [ROLES.ADMIN] },
  { pathPrefix: "/me/profile", allow: [ROLES.EMPLOYEE] },

  // Admin-only settings
  { pathPrefix: "/settings/organization", allow: [ROLES.ADMIN] },
  { pathPrefix: "/settings/departments", allow: [ROLES.ADMIN] },
  { pathPrefix: "/settings/roles", allow: [ROLES.ADMIN] },
  { pathPrefix: "/settings/attendance-policy", allow: [ROLES.ADMIN] },
  { pathPrefix: "/settings/leave-policy", allow: [ROLES.ADMIN] },
  { pathPrefix: "/settings/admin-notifications", allow: [ROLES.ADMIN] },
  { pathPrefix: "/settings/security", allow: [ROLES.ADMIN] },
  { pathPrefix: "/settings/branding", allow: [ROLES.ADMIN] },

  // Employee-only settings
  { pathPrefix: "/settings/profile", allow: [ROLES.EMPLOYEE] },
  { pathPrefix: "/settings/password", allow: [ROLES.EMPLOYEE] },
  { pathPrefix: "/settings/notifications", allow: [ROLES.EMPLOYEE] },
  { pathPrefix: "/settings/appearance", allow: [ROLES.EMPLOYEE] },
];

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function canAccessDashboardPath(pathname: string, role: AppRole): boolean {
  const path = normalizePath(pathname);

  for (const rule of DASHBOARD_ROUTE_RULES) {
    const prefix = rule.pathPrefix;
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      return rule.allow.includes(role);
    }
  }

  return true;
}

export { DASHBOARD_ROUTE_RULES };
