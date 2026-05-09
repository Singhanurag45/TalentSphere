import { Outlet } from "react-router-dom";

import { Sidebar } from "@/features/dashboard/layout/sidebar";
import { TopNavbar } from "@/features/dashboard/layout/top-navbar";
import { MobileSidebarDrawer } from "@/features/dashboard/layout/mobile-sidebar-drawer";

export function DashboardLayout() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-dashboard">
      <Sidebar />
      <div className="min-w-0">
        <div className="border-b p-3 lg:hidden">
          <MobileSidebarDrawer />
        </div>
        <TopNavbar />
        <main className="container py-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
