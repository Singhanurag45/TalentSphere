import type { LucideIcon } from "lucide-react";

import type { AppRole } from "@/shared/config/roles";

/**
 * Single sidebar entry. Each role config file lists only items for that role
 * (no per-item `roles` array needed on the item).
 */
export type AppNavItem = {
  label: string;
  /** Navbar title; defaults to `label` */
  pageTitle?: string;
  icon: LucideIcon;
  href: string;
  /** Extra path prefixes that should show this item's title in the navbar */
  matchPaths?: string[];
};

export type RoleNavDefinition = {
  role: AppRole;
  items: AppNavItem[];
};
