import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import type { AppRole } from "@/shared/config/roles";
import { useAuth } from "../context/auth-context";

type RequireRoleProps = {
  allow: AppRole[];
  /** Where to send users without permission (default: /unauthorized) */
  redirectTo?: string;
  children: ReactNode;
};

/**
 * Declarative route guard: renders children only when the signed-in user has an allowed role.
 */
export function RequireRole({
  allow,
  redirectTo = "/unauthorized",
  children,
}: RequireRoleProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !allow.includes(user.role)) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
