import { BarChart3, CalendarCheck2, LayoutDashboard, Settings, Users, UserCheck2 } from "lucide-react";
import { ROLES } from "@/shared/config/roles";

export const SIDEBAR_NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", roles: [ROLES.ADMIN, ROLES.EMPLOYEE] },
  { label: "Employees", icon: Users, href: "/employees", roles: [ROLES.ADMIN] },
  { label: "Attendance", icon: UserCheck2, href: "/attendance", roles: [ROLES.ADMIN, ROLES.EMPLOYEE] },
  { label: "Leaves", icon: CalendarCheck2, href: "/leaves", roles: [ROLES.ADMIN, ROLES.EMPLOYEE] },
  { label: "Reports", icon: BarChart3, href: "/reports", roles: [ROLES.ADMIN] },
  { label: "Settings", icon: Settings, href: "/settings", roles: [ROLES.ADMIN, ROLES.EMPLOYEE] },
] as const;
