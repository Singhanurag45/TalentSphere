import { Bell, ChevronDown, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/app/providers/theme-provider";
import { useAuth } from "@/features/auth/context/auth-context";
import { BrandLogo } from "@/shared/ui/brand-logo";
import { resolvePageTitle } from "@/app/navigation";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/features/notifications/api/notification-api";

const searchSchema = z.object({
  query: z.string().min(2, "Type at least 2 characters"),
});

type SearchFormInput = z.infer<typeof searchSchema>;

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications({ limit: 8 }),
    enabled: Boolean(user),
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

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

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {(notificationsQuery.data?.unreadCount ?? 0) > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {Math.min(notificationsQuery.data?.unreadCount ?? 0, 9)}
              </span>
            )}
          </Button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-40 w-80 rounded-2xl border bg-card p-2 shadow-float">
              <div className="flex items-center justify-between px-2 py-2">
                <p className="text-sm font-semibold">Notifications</p>
                <button
                  type="button"
                  onClick={() => markAllReadMutation.mutate()}
                  className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                  disabled={(notificationsQuery.data?.unreadCount ?? 0) === 0}
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notificationsQuery.isLoading ? (
                  <p className="px-2 py-4 text-sm text-muted-foreground">Loading...</p>
                ) : !notificationsQuery.data?.items.length ? (
                  <p className="px-2 py-4 text-sm text-muted-foreground">No notifications yet</p>
                ) : (
                  notificationsQuery.data.items.map((notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() => {
                        if (!notification.readAt) {
                          markReadMutation.mutate(notification._id);
                        }
                        setNotificationsOpen(false);
                        if (notification.link) navigate(notification.link);
                      }}
                      className="w-full rounded-xl px-3 py-2 text-left hover:bg-muted"
                    >
                      <div className="flex items-start gap-2">
                        {!notification.readAt && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{notification.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground/75">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
