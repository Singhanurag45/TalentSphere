import type { ReactNode } from "react";

import type { AppRole } from "@/shared/config/roles";

import { RequireRole } from "./require-role";

type RoleRouteProps = {
  allow: AppRole[];
  redirectTo?: string;
  children: ReactNode;
};

/** @deprecated Prefer `RequireRole` for new code — same behavior, clearer name. */
export function RoleRoute({ allow, redirectTo, children }: RoleRouteProps) {
  return (
    <RequireRole allow={allow} redirectTo={redirectTo}>
      {children}
    </RequireRole>
  );
}
