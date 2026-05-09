import { Navigate } from "react-router-dom";

import { useAuth } from "@/features/auth/context/auth-context";
import { ROLES } from "@/shared/config/roles";

import { AdminDashboardLayout } from "./admin-dashboard-layout";
import { EmployeeDashboardLayout } from "./employee-dashboard-layout";

/**
 * Picks the correct shell (sidebar + nav titles + mobile drawer) for the signed-in role.
 */
export function RoleDashboardLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === ROLES.ADMIN) {
    return <AdminDashboardLayout />;
  }

  return <EmployeeDashboardLayout />;
}
