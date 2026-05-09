import { Navigate, createBrowserRouter } from "react-router-dom";

import { DashboardLayout } from "./layouts/dashboard-layout";
import { DashboardHome } from "@/features/dashboard/pages/dashboard-home";
import { LoginPage } from "@/features/auth/pages/login-page";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { RoleRoute } from "@/features/auth/components/role-route";
import { EmployeesPage } from "@/features/employees/pages/employees-page";
import { EmployeeProfilePage } from "@/features/employees/pages/employee-profile-page";
import { ROLES } from "@/shared/config/roles";

const Placeholder = ({ title }: { title: string }) => (
  <div className="rounded-2xl border bg-card p-6 shadow-soft">
    <h1 className="text-xl font-semibold">{title}</h1>
    <p className="mt-2 text-sm text-muted-foreground">
      Module shell ready. Add feature pages next.
    </p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <Placeholder title="Unauthorized" />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <DashboardHome /> },
      {
        path: "/employees",
        element: (
          <RoleRoute allow={[ROLES.ADMIN]}>
            <EmployeesPage />
          </RoleRoute>
        ),
      },
      {
        path: "/employees/:employeeId",
        element: (
          <RoleRoute allow={[ROLES.ADMIN]}>
            <EmployeeProfilePage />
          </RoleRoute>
        ),
      },
      { path: "/attendance", element: <Placeholder title="Attendance" /> },
      { path: "/leaves", element: <Placeholder title="Leaves" /> },
      {
        path: "/reports",
        element: (
          <RoleRoute allow={[ROLES.ADMIN]}>
            <Placeholder title="Reports" />
          </RoleRoute>
        ),
      },
      { path: "/settings", element: <Placeholder title="Settings" /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
