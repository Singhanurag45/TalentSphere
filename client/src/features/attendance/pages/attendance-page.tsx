import { type FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Search,
  UserCheck2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/context/auth-context";
import { fetchEmployees } from "@/features/employees/api/employee-api";
import { ROLES } from "@/shared/config/roles";
import { DataTable, type DataTableColumn } from "@/shared/ui/data-table";
import {
  fetchAttendance,
  fetchAttendanceOverview,
  markAttendance,
} from "../api/attendance-api";
import type {
  AttendancePayload,
  AttendanceRecord,
  AttendanceStatus,
} from "../types/attendance";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: Array<{ value: AttendanceStatus; label: string; className: string }> = [
  { value: "present", label: "Present", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  { value: "late", label: "Late", className: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" },
  { value: "remote", label: "Remote", className: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300" },
  { value: "half-day", label: "Half Day", className: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300" },
  { value: "leave", label: "Leave", className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" },
  { value: "absent", label: "Absent", className: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300" },
];

const statusMap = new Map(STATUS_OPTIONS.map((status) => [status.value, status]));

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function getMonthBounds(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, monthNumber - 1, 1));
  const lastDay = new Date(Date.UTC(year, monthNumber, 0));
  return {
    startDate: firstDay.toISOString().slice(0, 10),
    endDate: lastDay.toISOString().slice(0, 10),
  };
}

function buildCalendarDays(
  month: string,
  records: AttendanceRecord[],
  dailyTrend: Array<{ date: string; present: number; absent: number; late: number }>,
  showTeamTotals: boolean,
) {
  type CalendarCell =
    | { key: string; isBlank: true }
    | {
        key: string;
        isBlank: false;
        date: string;
        day: number;
        record?: AttendanceRecord;
        trend?: { date: string; present: number; absent: number; late: number };
      };

  const [year, monthNumber] = month.split("-").map(Number);
  const totalDays = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();
  const byDate = new Map(records.map((record) => [record.attendanceDate.slice(0, 10), record]));
  const trendByDate = new Map(dailyTrend.map((entry) => [entry.date, entry]));
  const blanks: CalendarCell[] = Array.from({ length: firstWeekday }, (_, index) => ({
    key: `blank-${index}`,
    isBlank: true,
  }));
  const days: CalendarCell[] = Array.from({ length: totalDays }, (_, index) => {
    const date = `${month}-${String(index + 1).padStart(2, "0")}`;
    return {
      key: date,
      isBlank: false,
      date,
      day: index + 1,
      record: showTeamTotals ? undefined : byDate.get(date),
      trend: trendByDate.get(date),
    };
  });

  return [...blanks, ...days];
}

function StatusBadge({ status }: { status: AttendanceStatus }) {
  const entry = statusMap.get(status);
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${entry?.className || "bg-muted text-muted-foreground"}`}>
      {entry?.label || status}
    </span>
  );
}

export function AttendancePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const [page, setPage] = useState(1);
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState<"" | AttendanceStatus>("");
  const [month, setMonth] = useState(getCurrentMonth());
  const [dateRange, setDateRange] = useState(getMonthBounds(getCurrentMonth()));
  const [markForm, setMarkForm] = useState<AttendancePayload>({
    employeeId: "",
    attendanceDate: getToday(),
    status: "present",
    checkIn: "09:30",
    checkOut: "18:30",
    workHours: 8,
    note: "",
  });

  const attendanceFilters = {
    page,
    limit: PAGE_SIZE,
    employeeId,
    status,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  };

  const overviewFilters = { employeeId, month };

  const employeesQuery = useQuery({
    queryKey: ["employees", "attendance-picker"],
    queryFn: () =>
      fetchEmployees({
        page: 1,
        limit: 50,
        search: "",
        department: "",
        status: "active",
      }),
    enabled: isAdmin,
  });

  const attendanceQuery = useQuery({
    queryKey: ["attendance", attendanceFilters],
    queryFn: () => fetchAttendance(attendanceFilters),
  });

  const calendarQuery = useQuery({
    queryKey: ["attendance-calendar", employeeId, month],
    queryFn: () =>
      fetchAttendance({
        page: 1,
        limit: 100,
        employeeId,
        status: "",
        ...getMonthBounds(month),
      }),
  });

  const overviewQuery = useQuery({
    queryKey: ["attendance-overview", overviewFilters],
    queryFn: () => fetchAttendanceOverview(overviewFilters),
  });

  const markMutation = useMutation({
    mutationFn: markAttendance,
    onSuccess: () => {
      toast.success("Attendance marked");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-overview"] });
    },
    onError: () => toast.error("Unable to mark attendance"),
  });

  const records = attendanceQuery.data?.items || [];
  const calendarRecords = calendarQuery.data?.items || [];
  const overview = overviewQuery.data;
  const paginationMeta = attendanceQuery.data?.meta;

  const calendarDays = useMemo(
    () =>
      buildCalendarDays(
        month,
        calendarRecords,
        overview?.dailyTrend || [],
        isAdmin && !employeeId,
      ),
    [month, calendarRecords, overview?.dailyTrend, isAdmin, employeeId],
  );

  const columns = useMemo<DataTableColumn<AttendanceRecord>[]>(
    () => [
      {
        key: "employee",
        header: "Employee",
        render: (record) => (
          <div>
            <p className="font-medium leading-tight">
              {record.employee.firstName} {record.employee.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{record.employee.employeeCode}</p>
          </div>
        ),
      },
      {
        key: "date",
        header: "Date",
        render: (record) => formatDisplayDate(record.attendanceDate),
      },
      {
        key: "status",
        header: "Status",
        render: (record) => <StatusBadge status={record.status} />,
      },
      {
        key: "time",
        header: "Time",
        render: (record) => (
          <span>
            {record.checkIn || "--"} - {record.checkOut || "--"}
          </span>
        ),
      },
      {
        key: "hours",
        header: "Hours",
        render: (record) => `${record.workHours || 0}h`,
      },
      {
        key: "note",
        header: "Note",
        render: (record) => record.note || "-",
      },
    ],
    [],
  );

  const handleMarkAttendance = async (event: FormEvent) => {
    event.preventDefault();
    if (isAdmin && !markForm.employeeId) {
      toast.error("Choose an employee first");
      return;
    }

    await markMutation.mutateAsync({
      ...markForm,
      employeeId: isAdmin ? markForm.employeeId : undefined,
      workHours: Number(markForm.workHours || 0),
    });
  };

  const handleMonthChange = (nextMonth: string) => {
    setMonth(nextMonth);
    setDateRange(getMonthBounds(nextMonth));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <div className="grid gap-4 p-5 lg:grid-cols-[1.35fr_0.65fr] lg:p-6">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <UserCheck2 className="h-3.5 w-3.5" />
              Attendance Management
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              Track attendance, trends, and employee history
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Mark daily attendance, review monthly calendars, and monitor punctuality across teams with live analytics.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-emerald-50 p-4 dark:bg-emerald-950/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="mt-3 text-2xl font-semibold">{overview?.summary.attendanceRate || 0}%</p>
              <p className="text-xs text-muted-foreground">Rate</p>
            </div>
            <div className="rounded-2xl border bg-amber-50 p-4 dark:bg-amber-950/30">
              <Clock3 className="h-5 w-5 text-amber-600" />
              <p className="mt-3 text-2xl font-semibold">{overview?.summary.late || 0}</p>
              <p className="text-xs text-muted-foreground">Late</p>
            </div>
            <div className="rounded-2xl border bg-sky-50 p-4 dark:bg-sky-950/30">
              <CalendarDays className="h-5 w-5 text-sky-600" />
              <p className="mt-3 text-2xl font-semibold">{overview?.summary.records || 0}</p>
              <p className="text-xs text-muted-foreground">Records</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mark Attendance</h2>
            <CalendarCheck2 className="h-5 w-5 text-primary" />
          </div>
          <form className="grid gap-3" onSubmit={handleMarkAttendance}>
            {isAdmin && (
              <select
                className="h-11 rounded-full border bg-background px-4 text-sm outline-none transition focus:ring-4 focus:ring-ring/20"
                value={markForm.employeeId}
                onChange={(event) =>
                  setMarkForm((current) => ({ ...current, employeeId: event.target.value }))
                }
              >
                <option value="">Select employee</option>
                {(employeesQuery.data?.items || []).map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} - {employee.employeeCode}
                  </option>
                ))}
              </select>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                type="date"
                value={markForm.attendanceDate}
                onChange={(event) => setMarkForm((current) => ({ ...current, attendanceDate: event.target.value }))}
              />
              <select
                className="h-11 rounded-full border bg-background px-4 text-sm outline-none transition focus:ring-4 focus:ring-ring/20"
                value={markForm.status}
                onChange={(event) =>
                  setMarkForm((current) => ({ ...current, status: event.target.value as AttendanceStatus }))
                }
              >
                {STATUS_OPTIONS.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    {entry.label}
                  </option>
                ))}
              </select>
              <Input
                type="time"
                value={markForm.checkIn}
                onChange={(event) => setMarkForm((current) => ({ ...current, checkIn: event.target.value }))}
              />
              <Input
                type="time"
                value={markForm.checkOut}
                onChange={(event) => setMarkForm((current) => ({ ...current, checkOut: event.target.value }))}
              />
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={markForm.workHours}
                onChange={(event) => setMarkForm((current) => ({ ...current, workHours: Number(event.target.value) }))}
              />
              <Input
                value={markForm.note}
                placeholder="Note"
                onChange={(event) => setMarkForm((current) => ({ ...current, note: event.target.value }))}
              />
            </div>
            <Button type="submit" disabled={markMutation.isPending}>
              <UserCheck2 className="mr-1.5 h-4 w-4" />
              Save Attendance
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">Attendance Calendar</h2>
            <Input
              className="sm:w-44"
              type="month"
              value={month}
              onChange={(event) => handleMonthChange(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {calendarDays.map((day) => (
              <div
                key={day.key}
                className="min-h-20 rounded-2xl border bg-background p-2 text-sm"
              >
                {!day.isBlank && (
                  <>
                    <span className="font-medium">{day.day}</span>
                    {day.record && (
                      <div className="mt-2 space-y-1">
                        <StatusBadge status={day.record.status} />
                        <p className="truncate text-xs text-muted-foreground">
                          {day.record.employee.firstName} {day.record.employee.lastName}
                        </p>
                      </div>
                    )}
                    {!day.record && day.trend && (
                      <div className="mt-2 space-y-1 text-xs">
                        <p className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          {day.trend.present} present
                        </p>
                        <p className="text-muted-foreground">
                          {day.trend.late} late / {day.trend.absent} away
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-soft xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Monthly Attendance Tracking</h2>
            <p className="text-xs text-muted-foreground">{month}</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview?.dailyTrend || []}>
                <defs>
                  <linearGradient id="presentGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" fontSize={12} tickFormatter={(value) => value.slice(8)} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="present" stroke="#10b981" fill="url(#presentGradient)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="late" stroke="#f59e0b" fill="#f59e0b22" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Status Mix</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overview?.byStatus || []}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={58}
                  outerRadius={88}
                  fill="hsl(var(--primary))"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Employee Attendance Analytics</h2>
          <p className="text-xs text-muted-foreground">Top monthly records</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overview?.employeeBreakdown || []}>
              <XAxis dataKey="employeeName" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="attendanceRate" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-4 shadow-soft">
        <form className="grid gap-3 lg:grid-cols-6" onSubmit={(event) => event.preventDefault()}>
          {isAdmin && (
            <select
              className="h-11 rounded-full border bg-background px-4 text-sm outline-none transition focus:ring-4 focus:ring-ring/20 lg:col-span-2"
              value={employeeId}
              onChange={(event) => {
                setEmployeeId(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All employees</option>
              {(employeesQuery.data?.items || []).map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName} - {employee.employeeCode}
                </option>
              ))}
            </select>
          )}
          <select
            className="h-11 rounded-full border bg-background px-4 text-sm outline-none transition focus:ring-4 focus:ring-ring/20"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "" | AttendanceStatus);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
          <Input
            type="date"
            value={dateRange.startDate}
            onChange={(event) => setDateRange((current) => ({ ...current, startDate: event.target.value }))}
          />
          <Input
            type="date"
            value={dateRange.endDate}
            onChange={(event) => setDateRange((current) => ({ ...current, endDate: event.target.value }))}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStatus("");
              setEmployeeId("");
              setDateRange(getMonthBounds(month));
              setPage(1);
            }}
          >
            <Filter className="mr-1.5 h-4 w-4" />
            Reset
          </Button>
          <Button type="submit">
            <Search className="mr-1.5 h-4 w-4" />
            Filter
          </Button>
        </form>
      </section>

      <DataTable
        columns={columns}
        data={records}
        rowKey={(record) => record.id}
        isLoading={attendanceQuery.isLoading}
        emptyState={<p className="text-sm text-muted-foreground">No attendance records found for these filters.</p>}
      />

      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing page {paginationMeta?.page || 1} of {paginationMeta?.totalPages || 1} ({paginationMeta?.total || 0} records)
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={!paginationMeta?.hasPrevPage}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={!paginationMeta?.hasNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
