import { useAuth } from "@/features/auth/context/auth-context";
import { ROLES } from "@/shared/config/roles";

import { AdminDashboard } from "./admin-dashboard";
import { EmployeeDashboard } from "./employee-dashboard";

export function DashboardHome() {
  const { user } = useAuth();

  if (user?.role === ROLES.ADMIN) {
    return <AdminDashboard />;
  }

  return <EmployeeDashboard />;
}
