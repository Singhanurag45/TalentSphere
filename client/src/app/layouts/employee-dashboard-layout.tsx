import { Outlet } from "react-router-dom";

import { EMPLOYEE_SIDEBAR } from "@/app/navigation/employee-sidebar";

import { DashboardChrome } from "./dashboard-chrome";

export function EmployeeDashboardLayout() {
  return (
    <DashboardChrome navItems={EMPLOYEE_SIDEBAR.items}>
      <Outlet />
    </DashboardChrome>
  );
}
