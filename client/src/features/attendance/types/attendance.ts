export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "half-day"
  | "remote"
  | "leave";

export type AttendanceEmployee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
};

export type AttendanceRecord = {
  id: string;
  employee: AttendanceEmployee;
  attendanceDate: string;
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  workHours: number;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type AttendancePayload = {
  employeeId?: string;
  attendanceDate: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  note?: string;
};

export type AttendanceFilters = {
  page: number;
  limit: number;
  employeeId: string;
  status: "" | AttendanceStatus;
  startDate: string;
  endDate: string;
};

export type AttendanceOverviewFilters = {
  employeeId: string;
  month: string;
};

export type AttendanceOverview = {
  month: string;
  summary: {
    records: number;
    present: number;
    absent: number;
    late: number;
    leave: number;
    workHours: number;
    attendanceRate: number;
  };
  byStatus: Array<{
    status: AttendanceStatus;
    label: string;
    count: number;
    workHours: number;
  }>;
  dailyTrend: Array<{
    date: string;
    present: number;
    absent: number;
    late: number;
  }>;
  employeeBreakdown: Array<{
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    department: string;
    present: number;
    absent: number;
    late: number;
    workHours: number;
    attendanceRate: number;
  }>;
  recent: AttendanceRecord[];
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
