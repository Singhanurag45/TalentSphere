import {
  CalendarCheck2,
  LayoutDashboard,
  LineChart,
  Settings,
  Users,
  UserCheck2,
} from "lucide-react";

import { ROLES } from "@/shared/config/roles";

import type { RoleNavDefinition } from "./types";

export const ADMIN_SIDEBAR: RoleNavDefinition = {
  role: ROLES.ADMIN,
  items: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
    },
    {
      label: "Employees",
      icon: Users,
      href: "/employees",
      matchPaths: ["/employees"],
    },
    {
      label: "Attendance",
      icon: UserCheck2,
      href: "/attendance",
    },
    {
      label: "Leave Approvals",
      pageTitle: "Leave Approvals",
      icon: CalendarCheck2,
      href: "/leaves/approvals",
    },
    {
      label: "Analytics",
      pageTitle: "Analytics",
      icon: LineChart,
      href: "/leaves/analytics",
      matchPaths: ["/leaves/analytics"],
    },
    {
      label: "Settings",
      pageTitle: "Settings",
      icon: Settings,
      href: "/settings",
      matchPaths: ["/settings"],
    },
  ],
};
