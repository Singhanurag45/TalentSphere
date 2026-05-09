import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/context/auth-context";
import { ROLES } from "@/shared/config/roles";

export function SettingsRedirectPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === ROLES.ADMIN) {
    return <Navigate to="/settings/organization" replace />;
  }
  return <Navigate to="/settings/profile" replace />;
}
