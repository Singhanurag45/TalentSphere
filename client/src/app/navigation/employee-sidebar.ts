import {
  CalendarCheck2,
  LayoutDashboard,
  Settings,
  UserCheck2,
  UserCircle2,
} from "lucide-react";

import { ROLES } from "@/shared/config/roles";

import type { RoleNavDefinition } from "./types";

export const EMPLOYEE_SIDEBAR: RoleNavDefinition = {
  role: ROLES.EMPLOYEE,
  items: [
    {
      label: "My Dashboard",
      pageTitle: "My Dashboard",
      icon: LayoutDashboard,
      href: "/",
    },

    {
      label: "My Leaves",
      pageTitle: "My Leaves",
      icon: CalendarCheck2,
      href: "/leaves",
      matchPaths: ["/leaves/apply", "/leaves/history", "/leaves/balance"],
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
