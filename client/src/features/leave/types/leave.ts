export type LeaveType =
  | "annual"
  | "sick"
  | "casual"
  | "personal"
  | "unpaid"
  | "maternity"
  | "paternity";

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface LeaveComment {
  _id?: string;
  author: {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  text: string;
  createdAt: string;
}

export interface LeaveAttachment {
  fileName: string;
  fileUrl: string;
  uploadedAt?: string;
}

export interface Leave {
  _id: string;
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  leaveType: LeaveType;
  status: LeaveStatus;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason: string;
  appliedAt: string;
  appliedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  approvedAt?: string;
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  rejectionReason?: string;
  comments: LeaveComment[];
  attachments: LeaveAttachment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveTypeBalance {
  allocated: number;
  used: number;
  pending: number;
  carried_over: number;
}

export interface LeaveBalance {
  _id: string;
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  fiscal_year: string;
  leaveTypes: {
    annual: LeaveTypeBalance;
    sick: LeaveTypeBalance;
    casual: LeaveTypeBalance;
    personal: LeaveTypeBalance;
    unpaid: LeaveTypeBalance;
    maternity: LeaveTypeBalance;
    paternity: LeaveTypeBalance;
  };
  lastUpdated: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplyLeaveInput {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysRequested: number;
  reason: string;
  attachments?: LeaveAttachment[];
}

export interface ApproveLeaveInput {
  comment?: string;
}

export interface RejectLeaveInput {
  rejectionReason: string;
}

export interface CancelLeaveInput {
  reason?: string;
}

export interface AddCommentInput {
  text: string;
}

export interface LeaveAnalytics {
  _id: LeaveType | LeaveStatus | string;
  totalDays: number;
  count: number;
}

export interface ListLeavesParams {
  page?: number;
  limit?: number;
  status?: LeaveStatus;
  leaveType?: LeaveType;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ListLeavesResponse {
  items: Leave[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  casual: "Casual Leave",
  personal: "Personal Leave",
  unpaid: "Unpaid Leave",
  maternity: "Maternity Leave",
  paternity: "Paternity Leave",
};

export const LEAVE_STATUS_CONFIG: Record<
  LeaveStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-100 dark:bg-amber-950/50",
  },
  approved: {
    label: "Approved",
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/50",
  },
  rejected: {
    label: "Rejected",
    color: "text-rose-700 dark:text-rose-300",
    bgColor: "bg-rose-100 dark:bg-rose-950/50",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-slate-700 dark:text-slate-300",
    bgColor: "bg-slate-100 dark:bg-slate-950/50",
  },
};
