import { useMemo, type ComponentType, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlarmClock, Building2, CalendarRange, TrendingUp, Users } from "lucide-react";

import { fetchAttendanceOverview } from "@/features/attendance/api/attendance-api";
import { fetchEmployees } from "@/features/employees/api/employee-api";
import { getLeaveAnalytics } from "@/features/leave/api/leave-api";
import type { LeaveType, LeaveStatus } from "@/features/leave/types/leave";
import { LEAVE_TYPE_LABELS, LEAVE_STATUS_CONFIG } from "@/features/leave/types/leave";

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

const STATUS_COLORS: Record<LeaveStatus, string> = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  cancelled: "#6b7280",
};

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-soft md:p-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function formatAverage(totalDays: number, totalRequests: number) {
  if (!totalRequests) return "0.0";
  return (totalDays / totalRequests).toFixed(1);
}

export function AdminAnalyticsPage() {
  const month = getCurrentMonth();

  const overviewQuery = useQuery({
    queryKey: ["admin-analytics", "attendance-overview", month],
    queryFn: () => fetchAttendanceOverview({ employeeId: "", month }),
  });

  const employeesQuery = useQuery({
    queryKey: ["admin-analytics", "employees-headcount"],
    queryFn: () =>
      fetchEmployees({
        page: 1,
        limit: 500,
        search: "",
        department: "",
        status: "active",
      }),
  });

  const leaveTypeQuery = useQuery({
    queryKey: ["admin-analytics", "leave-type"],
    queryFn: () => getLeaveAnalytics({ groupBy: "leaveType" }),
  });

  const leaveStatusQuery = useQuery({
    queryKey: ["admin-analytics", "leave-status"],
    queryFn: () => getLeaveAnalytics({ groupBy: "status" }),
  });

  const overview = overviewQuery.data;

  const growthData = useMemo(() => {
    const items = employeesQuery.data?.items ?? [];
    if (!items.length) return [];

    const sorted = [...items].sort(
      (a, b) =>
        new Date(a.dateOfJoining).getTime() - new Date(b.dateOfJoining).getTime(),
    );

    const byMonth = new Map<string, number>();
    for (const emp of sorted) {
      const key = emp.dateOfJoining.slice(0, 7);
      byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
    }

    const keys = [...byMonth.keys()].sort();
    let cumulative = 0;
    return keys.map((key) => {
      cumulative += byMonth.get(key) ?? 0;
      return {
        month: key,
        label: key,
        hired: byMonth.get(key) ?? 0,
        headcount: cumulative,
      };
    });
  }, [employeesQuery.data?.items]);

  const departmentPerformance = useMemo(() => {
    const rows = overview?.employeeBreakdown ?? [];
    const byDept = new Map<
      string,
      { present: number; absent: number; late: number; total: number }
    >();

    for (const row of rows) {
      const dept = row.department || "Unassigned";
      const cur = byDept.get(dept) ?? {
        present: 0,
        absent: 0,
        late: 0,
        total: 0,
      };
      cur.present += row.present;
      cur.absent += row.absent;
      cur.late += row.late;
      cur.total += row.present + row.absent + row.late;
      byDept.set(dept, cur);
    }

    return [...byDept.entries()]
      .map(([name, v]) => ({
        name,
        score:
          v.total > 0 ? Math.round((v.present / v.total) * 100) : 0,
        late: v.late,
        present: v.present,
        total: v.total,
      }))
      .sort((a, b) => b.score - a.score);
  }, [overview?.employeeBreakdown]);

  const lateLeaders = useMemo(() => {
    const rows = [...(overview?.employeeBreakdown ?? [])];
    return rows.sort((a, b) => b.late - a.late).slice(0, 10);
  }, [overview?.employeeBreakdown]);

  const typeChartData =
    leaveTypeQuery.data?.map((item) => ({
      name: LEAVE_TYPE_LABELS[item._id as LeaveType] || String(item._id),
      days: item.totalDays,
      count: item.count,
      _id: item._id,
    })) ?? [];

  const statusChartData =
    leaveStatusQuery.data?.map((item) => ({
      name: LEAVE_STATUS_CONFIG[item._id as LeaveStatus]?.label || String(item._id),
      value: item.count,
      _id: item._id,
    })) ?? [];

  const totalLeaveDays =
    leaveTypeQuery.data?.reduce((s, i) => s + i.totalDays, 0) ?? 0;
  const totalLeaveRequests =
    leaveTypeQuery.data?.reduce((s, i) => s + i.count, 0) ?? 0;

  const dailyTrend = overview?.dailyTrend ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Organization-wide attendance, leave, headcount, and performance signals.
        </p>
      </div>

      <SectionCard
        icon={CalendarRange}
        title="Attendance Trends"
        description={`Daily present, absent, and late volume for ${overview?.month ?? month}.`}
      >
        {overviewQuery.isLoading ? (
          <div className="h-[280px] animate-pulse rounded-xl bg-muted" />
        ) : dailyTrend.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No attendance trend data for this month.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="present"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.35}
                name="Present"
              />
              <Area
                type="monotone"
                dataKey="absent"
                stackId="2"
                stroke="#f43f5e"
                fill="#f43f5e"
                fillOpacity={0.3}
                name="Absent"
              />
              <Area
                type="monotone"
                dataKey="late"
                stackId="3"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.35}
                name="Late"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </SectionCard>

      <SectionCard
        icon={TrendingUp}
        title="Leave Analytics"
        description="Approved leave days and request mix by type and status."
      >
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground">Total requests</p>
            <p className="mt-1 text-2xl font-semibold text-primary">
              {leaveTypeQuery.isLoading ? "—" : totalLeaveRequests}
            </p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground">Days (approved)</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
              {leaveTypeQuery.isLoading ? "—" : totalLeaveDays}
            </p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground">Avg. duration</p>
            <p className="mt-1 text-2xl font-semibold text-violet-600 dark:text-violet-400">
              {leaveTypeQuery.isLoading
                ? "—"
                : `${formatAverage(totalLeaveDays, totalLeaveRequests)} days`}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              By leave type
            </h3>
            {leaveTypeQuery.isLoading ? (
              <div className="h-[260px] animate-pulse rounded-xl bg-muted" />
            ) : typeChartData.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={typeChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="days" name="Days" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              By status
            </h3>
            {leaveStatusQuery.isLoading ? (
              <div className="h-[260px] animate-pulse rounded-xl bg-muted" />
            ) : statusChartData.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={88}
                    dataKey="value"
                  >
                    {statusChartData.map((entry) => (
                      <Cell
                        key={String(entry._id)}
                        fill={STATUS_COLORS[entry._id as LeaveStatus]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={Users}
        title="Employee Growth"
        description="Cumulative active headcount by hire month (from employee records)."
      >
        {employeesQuery.isLoading ? (
          <div className="h-[280px] animate-pulse rounded-xl bg-muted" />
        ) : growthData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No employee data to chart.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="headcount"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                name="Headcount"
              />
              <Line
                type="monotone"
                dataKey="hired"
                stroke="#94a3b8"
                strokeWidth={2}
                dot={false}
                name="Hired in month"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </SectionCard>

      <SectionCard
        icon={Building2}
        title="Department Performance"
        description="Attendance score by department (share of present vs all logged days in overview sample)."
      >
        {overviewQuery.isLoading ? (
          <div className="h-[280px] animate-pulse rounded-xl bg-muted" />
        ) : departmentPerformance.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No department breakdown for this period.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={departmentPerformance} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="score" name="Score %" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </SectionCard>

      <SectionCard
        icon={AlarmClock}
        title="Late Arrivals"
        description="Employees with the highest late counts in the selected attendance month."
      >
        {overviewQuery.isLoading ? (
          <div className="h-40 animate-pulse rounded-xl bg-muted" />
        ) : lateLeaders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No late arrival data for this month.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Employee</th>
                  <th className="px-4 py-3 text-left font-medium">Department</th>
                  <th className="px-4 py-3 text-right font-medium">Late</th>
                  <th className="px-4 py-3 text-right font-medium">Present</th>
                  <th className="px-4 py-3 text-right font-medium">Rate</th>
                </tr>
              </thead>
              <tbody>
                {lateLeaders.map((row) => (
                  <tr key={row.employeeId} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <span className="font-medium">{row.employeeName}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {row.employeeCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.department}</td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                      {row.late}
                    </td>
                    <td className="px-4 py-3 text-right">{row.present}</td>
                    <td className="px-4 py-3 text-right">{row.attendanceRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
