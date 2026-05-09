import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import { SIDEBAR_NAV_ITEMS } from "./navigation-config";
import { cn } from "@/shared/lib/cn";
import { useAuth } from "@/features/auth/context/auth-context";
import { BrandLogo } from "@/shared/ui/brand-logo";

export function Sidebar() {
  const { user } = useAuth();
  const navItems = SIDEBAR_NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside className="hidden border-r bg-card/70 p-4 backdrop-blur lg:block">
      <div className="mb-8 px-2">
        <BrandLogo />
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex h-11 items-center gap-3 rounded-full px-4 text-sm transition",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
}
