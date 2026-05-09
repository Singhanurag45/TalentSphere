import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { AppRole } from "@/shared/config/roles";
import { useAuth } from "../context/auth-context";

export function RoleRoute({ allow, children }: { allow: AppRole[]; children: ReactNode }) {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
