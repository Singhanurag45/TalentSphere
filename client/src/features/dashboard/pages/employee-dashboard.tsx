import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Plus, Clock, FileText } from "lucide-react";

import { useAuth } from "@/features/auth/context/auth-context";
import { KpiCard } from "../components/kpi-card";
import { DashboardSkeleton } from "../components/dashboard-skeleton";

const upcomingHolidays = [
  { name: "Independence Day", date: "Aug 15, 2026", daysLeft: 97 },
  { name: "Diwali", date: "Nov 8, 2026", daysLeft: 182 },
  { name: "Christmas", date: "Dec 25, 2026", daysLeft: 229 },
];

const recentActivity = [
  { action: "Leave Approved", detail: "Annual Leave (3 days)", time: "2 days ago", icon: FileText, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50" },
  { action: "Applied for Leave", detail: "Sick Leave (1 day)", time: "5 days ago", icon: Clock, color: "text-amber-600 bg-amber-100 dark:bg-amber-950/50" },
];

export function EmployeeDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening in your workspace today.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/leaves/apply")}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Apply Leave
          </button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <KpiCard title="Available Leaves" value="12 Days" change="Annual & Sick" toneClassName="bg-sky-50 dark:bg-sky-950/40" delay={0} />
        <KpiCard title="Pending Requests" value="0" change="All clear" toneClassName="bg-emerald-50 dark:bg-emerald-950/40" delay={0.05} />
        <KpiCard title="Next Holiday" value="Aug 15" change="Independence Day" toneClassName="bg-violet-50 dark:bg-violet-950/40" delay={0.1} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border bg-card p-5 shadow-soft md:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Holidays</h2>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-3">
            {upcomingHolidays.map((holiday) => (
              <div key={holiday.name} className="flex items-center justify-between rounded-xl border bg-muted/30 p-3">
                <div>
                  <p className="text-sm font-medium">{holiday.name}</p>
                  <p className="text-xs text-muted-foreground">{holiday.date}</p>
                </div>
                <div className="rounded-lg bg-background px-3 py-1 text-xs font-medium border shadow-sm">
                  In {holiday.daysLeft} days
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border bg-card p-5 shadow-soft md:p-6"
        >
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${activity.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
