import {
  Bell,
  Building2,
  CalendarDays,
  ClipboardList,
  ImageIcon,
  Lock,
  Palette,
  Shield,
  User,
  Users,
  Briefcase,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SettingsNavItem = { to: string; label: string; icon: LucideIcon };

export const EMPLOYEE_SETTINGS_NAV: SettingsNavItem[] = [
  { to: "/settings/profile", label: "Profile", icon: User },
  { to: "/settings/password", label: "Password", icon: Lock },
  { to: "/settings/notifications", label: "Notifications", icon: Bell },
  { to: "/settings/appearance", label: "Appearance", icon: Palette },
];

export const ADMIN_SETTINGS_NAV: SettingsNavItem[] = [
  { to: "/settings/organization", label: "Organization", icon: Building2 },
  { to: "/settings/departments", label: "Departments", icon: Briefcase },
  { to: "/settings/roles", label: "Roles", icon: Users },
  { to: "/settings/attendance-policy", label: "Attendance policy", icon: ClipboardList },
  { to: "/settings/leave-policy", label: "Leave policy", icon: CalendarDays },
  { to: "/settings/admin-notifications", label: "Notifications", icon: Bell },
  { to: "/settings/security", label: "Security", icon: Shield },
  { to: "/settings/branding", label: "Branding", icon: ImageIcon },
];
