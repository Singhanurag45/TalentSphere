import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import { cn } from "@/shared/lib/cn";
import { BrandLogo } from "@/shared/ui/brand-logo";
import type { AppNavItem } from "@/app/navigation/types";

type SidebarProps = {
  items: AppNavItem[];
};

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="hidden border-r bg-card/70 p-4 backdrop-blur lg:block">
      <div className="mb-8 px-2">
        <BrandLogo />
      </div>

      <nav className="space-y-1.5">
        {items.map((item, index) => (
          <motion.div
            key={item.href}
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
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
