import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/features/auth/context/auth-context";

import { canAccessDashboardPath } from "./route-access";

/**
 * Route-level access check (SPA "middleware"). Complements per-route `<RoleRoute />`
 * by blocking deep links that are not allowed for the current role.
 */
export function RouteAccessGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user) {
    return null;
  }

  if (!canAccessDashboardPath(pathname, user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
