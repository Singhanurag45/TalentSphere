import type { ReactNode } from "react";

import { MobileSidebarDrawer } from "@/features/dashboard/layout/mobile-sidebar-drawer";
import { Sidebar } from "@/features/dashboard/layout/sidebar";
import { TopNavbar } from "@/features/dashboard/layout/top-navbar";
import { RouteAccessGuard } from "@/app/guards/route-access-guard";
import type { AppNavItem } from "@/app/navigation/types";

type DashboardChromeProps = {
  navItems: AppNavItem[];
  children: ReactNode;
};

export function DashboardChrome({ navItems, children }: DashboardChromeProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-dashboard">
      <Sidebar items={navItems} />
      <div className="min-w-0">
        <div className="border-b p-3 lg:hidden">
          <MobileSidebarDrawer items={navItems} />
        </div>
        <TopNavbar />
        <main className="container py-6 md:py-8">
          <RouteAccessGuard>{children}</RouteAccessGuard>
        </main>
      </div>
    </div>
  );
}
