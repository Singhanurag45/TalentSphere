import { Outlet } from "react-router-dom";

import { ADMIN_SIDEBAR } from "@/app/navigation/admin-sidebar";

import { DashboardChrome } from "./dashboard-chrome";

export function AdminDashboardLayout() {
  return (
    <DashboardChrome navItems={ADMIN_SIDEBAR.items}>
      <Outlet />
    </DashboardChrome>
  );
}
