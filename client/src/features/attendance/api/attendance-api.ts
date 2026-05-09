import { http } from "@/shared/api/http";

import type {
  AttendanceFilters,
  AttendanceOverview,
  AttendanceOverviewFilters,
  AttendancePayload,
  AttendanceRecord,
  PaginationMeta,
} from "../types/attendance";

type ApiResponse<TData, TMeta = null> = {
  success: boolean;
  message: string;
  data: TData;
  meta: TMeta;
  error: unknown;
};

export async function fetchAttendance(filters: AttendanceFilters) {
  const { data } = await http.get<ApiResponse<AttendanceRecord[], PaginationMeta>>(
    "/attendance",
    {
      params: {
        page: filters.page,
        limit: filters.limit,
        employeeId: filters.employeeId || undefined,
        status: filters.status || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      },
    },
  );

  return {
    items: data.data,
    meta: data.meta,
  };
}

export async function fetchAttendanceOverview(filters: AttendanceOverviewFilters) {
  const { data } = await http.get<ApiResponse<AttendanceOverview>>(
    "/attendance/overview",
    {
      params: {
        employeeId: filters.employeeId || undefined,
        month: filters.month,
      },
    },
  );

  return data.data;
}

export async function markAttendance(payload: AttendancePayload) {
  const { data } = await http.post<ApiResponse<AttendanceRecord>>(
    "/attendance",
    payload,
  );
  return data.data;
}
