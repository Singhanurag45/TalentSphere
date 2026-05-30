import { Navigate, createBrowserRouter } from "react-router-dom";

import { RoleDashboardLayout } from "./layouts/role-dashboard-layout";
import { DashboardHome } from "@/features/dashboard/pages/dashboard-home";
import { LoginPage } from "@/features/auth/pages/login-page";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { RoleRoute } from "@/features/auth/components/role-route";
import { EmployeesPage } from "@/features/employees/pages/employees-page";
import { EmployeeProfilePage } from "@/features/employees/pages/employee-profile-page";
import { AttendancePage } from "@/features/attendance/pages/attendance-page";
import { ROLES } from "@/shared/config/roles";
import { useAuth } from "@/features/auth/context/auth-context";
import { ApplyLeavePage } from "@/features/leave/pages/apply-leave-page";
import { LeaveApprovalsPage } from "@/features/leave/pages/leave-approvals-page";
import { LeaveBalancePage } from "@/features/leave/pages/leave-balance-page";
import { LeaveHistoryPage } from "@/features/leave/pages/leave-history-page";
import { AdminAnalyticsPage } from "@/features/analytics/pages/admin-analytics-page";
import { SettingsLayout } from "@/features/settings/layout/settings-layout";
import { SettingsRedirectPage } from "@/features/settings/pages/settings-redirect-page";
import { ProfileSettingsPage } from "@/features/settings/pages/employee/profile-settings-page";
import { PasswordSettingsPage } from "@/features/settings/pages/employee/password-settings-page";
import { NotificationsSettingsPage } from "@/features/settings/pages/employee/notifications-settings-page";
import { AppearanceSettingsPage } from "@/features/settings/pages/employee/appearance-settings-page";
import { OrganizationSettingsPage } from "@/features/settings/pages/admin/organization-settings-page";
import { DepartmentsSettingsPage } from "@/features/settings/pages/admin/departments-settings-page";
import { RolesSettingsPage } from "@/features/settings/pages/admin/roles-settings-page";
import { AttendancePolicyPage } from "@/features/settings/pages/admin/attendance-policy-page";
import { LeavePolicyPage } from "@/features/settings/pages/admin/leave-policy-page";
import { AdminNotificationsPage } from "@/features/settings/pages/admin/admin-notifications-page";
import { SecuritySettingsPage } from "@/features/settings/pages/admin/security-settings-page";
import { BrandingSettingsPage } from "@/features/settings/pages/admin/branding-settings-page";

const Placeholder = ({ title }: { title: string }) => (
  <div className="rounded-2xl border bg-card p-6 shadow-soft">
    <h1 className="text-xl font-semibold">{title}</h1>
    <p className="mt-2 text-sm text-muted-foreground">
      Module shell ready. Add feature pages next.
    </p>
  </div>
);

function LeavesHomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Navigate
      to={user.role === ROLES.ADMIN ? "/leaves/approvals" : "/leaves/history"}
      replace
    />
  );
}

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
        <RoleDashboardLayout />
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
      { path: "/attendance", element: <AttendancePage /> },
      { path: "/leaves", element: <LeavesHomeRedirect /> },
      {
        path: "/leaves/apply",
        element: (
          <RoleRoute allow={[ROLES.EMPLOYEE]}>
            <ApplyLeavePage />
          </RoleRoute>
        ),
      },
      {
        path: "/leaves/approvals",
        element: (
          <RoleRoute allow={[ROLES.ADMIN]}>
            <LeaveApprovalsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/leaves/balance",
        element: <LeaveBalancePage />,
      },
      {
        path: "/leaves/history",
        element: <LeaveHistoryPage />,
      },
      {
        path: "/leaves/analytics",
        element: (
          <RoleRoute allow={[ROLES.ADMIN]}>
            <AdminAnalyticsPage />
          </RoleRoute>
        ),
      },
      {
        path: "/me/profile",
        element: (
          <RoleRoute allow={[ROLES.EMPLOYEE]}>
            <Placeholder title="My Profile" />
          </RoleRoute>
        ),
      },
      {
        path: "/settings",
        element: <SettingsLayout />,
        children: [
          { index: true, element: <SettingsRedirectPage /> },
          {
            path: "profile",
            element: (
              <RoleRoute allow={[ROLES.EMPLOYEE]}>
                <ProfileSettingsPage />
              </RoleRoute>
            ),
          },
          {
            path: "password",
            element: (
              <RoleRoute allow={[ROLES.EMPLOYEE]}>
                <PasswordSettingsPage />
              </RoleRoute>
            ),
          },
          {
            path: "notifications",
            element: (
              <RoleRoute allow={[ROLES.EMPLOYEE]}>
                <NotificationsSettingsPage />
              </RoleRoute>
            ),
          },
          {
            path: "appearance",
            element: (
              <RoleRoute allow={[ROLES.EMPLOYEE]}>
                <AppearanceSettingsPage />
              </RoleRoute>
            ),
          },
          {
            path: "organization",
            element: (
              <RoleRoute allow={[ROLES.ADMIN]}>
                <OrganizationSettingsPage />
              </RoleRoute>
            ),
          },
          {
            path: "departments",
            element: (
              <RoleRoute allow={[ROLES.ADMIN]}>
                <DepartmentsSettingsPage />
              </RoleRoute>
            ),
          },
          {
            path: "roles",
            element: (
              <RoleRoute allow={[ROLES.ADMIN]}>
                <RolesSettingsPage />
              </RoleRoute>
            ),
          },
          {
            path: "attendance-policy",
            element: (
              <RoleRoute allow={[ROLES.ADMIN]}>
                <AttendancePolicyPage />
              </RoleRoute>
            ),
          },
          {
            path: "leave-policy",
            element: (
              <RoleRoute allow={[ROLES.ADMIN]}>
                <LeavePolicyPage />
              </RoleRoute>
            ),
          },
          {
            path: "admin-notifications",
            element: (
              <RoleRoute allow={[ROLES.ADMIN]}>
                <AdminNotificationsPage />
              </RoleRoute>
            ),
          },
          {
            path: "security",
            element: (
              <RoleRoute allow={[ROLES.ADMIN]}>
                <SecuritySettingsPage />
              </RoleRoute>
            ),
          },
          {
            path: "branding",
            element: (
              <RoleRoute allow={[ROLES.ADMIN]}>
                <BrandingSettingsPage />
              </RoleRoute>
            ),
          },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
