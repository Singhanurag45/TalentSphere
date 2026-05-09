/** Longest prefix wins — used for navbar titles inside /settings. */
export const SETTINGS_ROUTE_TITLES: { prefix: string; title: string }[] = [
  { prefix: "/settings/organization", title: "Organization" },
  { prefix: "/settings/departments", title: "Departments" },
  { prefix: "/settings/roles", title: "Roles & access" },
  { prefix: "/settings/attendance-policy", title: "Attendance policy" },
  { prefix: "/settings/leave-policy", title: "Leave policy" },
  { prefix: "/settings/admin-notifications", title: "Notification settings" },
  { prefix: "/settings/security", title: "Security" },
  { prefix: "/settings/branding", title: "Branding" },
  { prefix: "/settings/profile", title: "Profile" },
  { prefix: "/settings/password", title: "Password" },
  { prefix: "/settings/notifications", title: "Notifications" },
  { prefix: "/settings/appearance", title: "Appearance" },
  { prefix: "/settings", title: "Settings" },
].sort((a, b) => b.prefix.length - a.prefix.length);

export function resolveSettingsPageTitle(pathname: string): string | null {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  for (const { prefix, title } of SETTINGS_ROUTE_TITLES) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return title;
    }
  }
  return null;
}
