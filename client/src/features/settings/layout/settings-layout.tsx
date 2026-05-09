import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/context/auth-context";
import { ROLES } from "@/shared/config/roles";
import { cn } from "@/shared/lib/cn";

import { ADMIN_SETTINGS_NAV, EMPLOYEE_SETTINGS_NAV } from "../config/settings-nav";

export function SettingsLayout() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const links = isAdmin ? ADMIN_SETTINGS_NAV : EMPLOYEE_SETTINGS_NAV;

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      <aside className="shrink-0 lg:w-56">
        <div className="rounded-2xl border bg-card p-2 shadow-soft">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {isAdmin ? "Admin settings" : "Your settings"}
          </p>
          <nav className="space-y-0.5">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
