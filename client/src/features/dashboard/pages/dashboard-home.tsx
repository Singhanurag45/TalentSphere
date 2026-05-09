import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { KpiCard } from "../components/kpi-card";
import { DashboardSkeleton } from "../components/dashboard-skeleton";
import { AttendanceAnalyticsChart } from "../components/charts/attendance-analytics-chart";
import { TeamPerformanceChart } from "../components/charts/team-performance-chart";

const kpiCards = [
  { title: "Employee Count", value: "248", change: "+8 this month", toneClassName: "bg-primary-soft" },
  { title: "Attendance Summary", value: "94.2%", change: "12 late check-ins", toneClassName: "bg-sky-50 dark:bg-sky-950/40" },
  { title: "Leave Summary", value: "14 Active", change: "6 pending approvals", toneClassName: "bg-violet-50 dark:bg-violet-950/40" },
  { title: "Active Employees", value: "226", change: "91% currently online", toneClassName: "bg-emerald-50 dark:bg-emerald-950/40" },
];

const attendanceData = [
  { day: "Mon", attendance: 90 },
  { day: "Tue", attendance: 93 },
  { day: "Wed", attendance: 91 },
  { day: "Thu", attendance: 95 },
  { day: "Fri", attendance: 94 },
  { day: "Sat", attendance: 88 },
  { day: "Sun", attendance: 86 },
];

const teamPerformance = [
  { team: "Recruiting", score: 82 },
  { team: "Engineering", score: 91 },
  { team: "Finance", score: 78 },
  { team: "Operations", score: 86 },
  { team: "Support", score: 88 },
];

const leaveRequests = [
  { employee: "Aarav Sharma", type: "Sick Leave", days: "2 days", status: "Pending" },
  { employee: "Neha Kapoor", type: "Annual Leave", days: "5 days", status: "Approved" },
  { employee: "Rohan Mehta", type: "Casual Leave", days: "1 day", status: "Pending" },
  { employee: "Isha Verma", type: "Annual Leave", days: "3 days", status: "Pending" },
];

export function DashboardHome() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">TalentSphere HR Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time people insights across attendance, leaves, and team productivity.
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card, index) => (
          <KpiCard key={card.title} {...card} delay={index * 0.05} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="xl:col-span-2 rounded-2xl border bg-card p-5 shadow-soft md:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Attendance Analytics</h2>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </div>
          <AttendanceAnalyticsChart data={attendanceData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="rounded-2xl border bg-card p-5 shadow-soft md:p-6"
        >
          <h2 className="text-lg font-semibold">Recent Leave Requests</h2>
          <div className="mt-4 space-y-3">
            {leaveRequests.map((request) => (
              <div key={`${request.employee}-${request.type}`} className="rounded-xl border bg-muted/30 p-3">
                <p className="text-sm font-medium">{request.employee}</p>
                <p className="text-xs text-muted-foreground">
                  {request.type} · {request.days}
                </p>
                <p className="mt-1 text-xs font-medium text-primary">{request.status}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 rounded-2xl border bg-card p-5 shadow-soft md:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Team Performance Widgets</h2>
            <p className="text-xs text-muted-foreground">Monthly score</p>
          </div>
          <TeamPerformanceChart data={teamPerformance} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="rounded-2xl border bg-card p-5 shadow-soft md:p-6"
        >
          <h2 className="text-lg font-semibold">Attendance Summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-xl border bg-emerald-50 p-3 dark:bg-emerald-950/30">
              <p className="font-medium">Present Today</p>
              <p className="text-muted-foreground">226 employees</p>
            </li>
            <li className="rounded-xl border bg-amber-50 p-3 dark:bg-amber-950/30">
              <p className="font-medium">Late Arrivals</p>
              <p className="text-muted-foreground">12 employees</p>
            </li>
            <li className="rounded-xl border bg-sky-50 p-3 dark:bg-sky-950/30">
              <p className="font-medium">On Remote</p>
              <p className="text-muted-foreground">37 employees</p>
            </li>
          </ul>
        </motion.div>
      </section>
    </div>
  );
}
