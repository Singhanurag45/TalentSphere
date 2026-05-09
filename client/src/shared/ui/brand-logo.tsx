import { Link } from "react-router-dom";

import { useTheme } from "@/app/providers/theme-provider";
import { cn } from "@/shared/lib/cn";

type BrandLogoProps = {
  withLabel?: boolean;
  className?: string;
  to?: string;
};

export function BrandLogo({ withLabel = true, className, to = "/" }: BrandLogoProps) {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/dark-mode-logo.png" : "/light-mode-logo.png";

  return (
    <Link to={to} className={cn("inline-flex items-center gap-3", className)}>
      <img src={logoSrc} alt="TalentSphere" className="h-10 w-auto" />
      {withLabel ? (
        <div className="leading-tight">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            TalentSphere
          </p>
          <p className="text-sm font-semibold text-foreground">People Ops</p>
        </div>
      ) : null}
    </Link>
  );
}