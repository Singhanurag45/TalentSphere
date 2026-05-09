import {
  BarChart3,
  CalendarCheck2,
  LayoutDashboard,
  Settings,
  Users,
  UserCheck2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROLES } from "@/shared/config/roles";
import type { AppRole } from "@/shared/config/roles";

type SidebarNavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  roles: AppRole[];
};

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  { label: "Employees", icon: Users, href: "/employees", roles: [ROLES.ADMIN] },
  {
    label: "Attendance",
    icon: UserCheck2,
    href: "/attendance",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  {
    label: "Leaves",
    icon: CalendarCheck2,
    href: "/leaves",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  { label: "Reports", icon: BarChart3, href: "/reports", roles: [ROLES.ADMIN] },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
];
