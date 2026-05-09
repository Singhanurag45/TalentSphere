import { Bell, ChevronDown, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/app/providers/theme-provider";
import { useAuth } from "@/features/auth/context/auth-context";
import { BrandLogo } from "@/shared/ui/brand-logo";
import { resolvePageTitle } from "@/app/navigation";

const searchSchema = z.object({
  query: z.string().min(2, "Type at least 2 characters"),
});

type SearchFormInput = z.infer<typeof searchSchema>;

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const pageTitle =
    user ? resolvePageTitle(location.pathname, user.role) : "Sign in";
  const { register, handleSubmit, formState } = useForm<SearchFormInput>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  const onSubmit = (values: SearchFormInput) => {
    toast.success(`Searching for "${values.query}"`);
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center gap-3">
        <div className="min-w-0 shrink-0">
          <BrandLogo withLabel={false} className="hidden md:flex" />
          <p className="truncate text-sm font-semibold tracking-tight text-foreground md:mt-1 md:text-xs md:font-medium md:text-muted-foreground">
            {pageTitle}
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative w-full max-w-xl"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            {...register("query")}
            className="pl-9"
            placeholder="Search employees, teams, or reports..."
            aria-invalid={Boolean(formState.errors.query)}
          />
        </form>

        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <div className="relative">
          <Button
            variant="outline"
            className="h-11 gap-2 px-2.5"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="hidden text-sm md:block">
              {user ? `${user.firstName} ${user.lastName}` : "Profile"}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>

          {menuOpen && (
            <div className="absolute right-0 top-12 z-40 w-52 rounded-2xl border bg-card p-1 shadow-float">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
              <button
                className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={async () => {
                  setMenuOpen(false);
                  await logout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
