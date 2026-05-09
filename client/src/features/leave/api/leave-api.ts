import { http } from "@/shared/api/http";
import type {
  Leave,
  LeaveBalance,
  ApplyLeaveInput,
  ApproveLeaveInput,
  RejectLeaveInput,
  CancelLeaveInput,
  AddCommentInput,
  ListLeavesResponse,
  ListLeavesParams,
  LeaveAnalytics,
} from "../types/leave";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
};

export async function applyLeave(payload: ApplyLeaveInput) {
  const { data } = await http.post<ApiResponse<Leave>>("/leaves", payload);
  return data.data;
}

export async function approveLeave(
  leaveId: string,
  payload: ApproveLeaveInput,
) {
  const { data } = await http.post<ApiResponse<Leave>>(
    `/leaves/${leaveId}/approve`,
    payload,
  );
  return data.data;
}

export async function rejectLeave(leaveId: string, payload: RejectLeaveInput) {
  const { data } = await http.post<ApiResponse<Leave>>(
    `/leaves/${leaveId}/reject`,
    payload,
  );
  return data.data;
}

export async function cancelLeave(leaveId: string, payload: CancelLeaveInput) {
  const { data } = await http.post<ApiResponse<Leave>>(
    `/leaves/${leaveId}/cancel`,
    payload,
  );
  return data.data;
}

export async function addLeaveComment(
  leaveId: string,
  payload: AddCommentInput,
) {
  const { data } = await http.post<ApiResponse<Leave>>(
    `/leaves/${leaveId}/comment`,
    payload,
  );
  return data.data;
}

export async function getLeaveBalance(
  employeeId?: string,
  fiscalYear?: string,
) {
  const { data } = await http.get<ApiResponse<LeaveBalance>>(
    "/leaves/balance",
    {
      params: {
        ...(employeeId && { employeeId }),
        ...(fiscalYear && { fiscalYear }),
      },
    },
  );
  return data.data;
}

export async function listLeaves(params?: ListLeavesParams) {
  const { data } = await http.get<
    ApiResponse<Leave> & { meta: ListLeavesResponse["meta"] }
  >("/leaves", {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      ...(params?.status && { status: params.status }),
      ...(params?.leaveType && { leaveType: params.leaveType }),
      ...(params?.employeeId && { employeeId: params.employeeId }),
      ...(params?.startDate && { startDate: params.startDate }),
      ...(params?.endDate && { endDate: params.endDate }),
    },
  });
  return {
    items: Array.isArray(data.data) ? data.data : [data.data],
    meta: data.meta,
  } as ListLeavesResponse;
}

export async function getLeaveById(leaveId: string) {
  const { data } = await http.get<ApiResponse<Leave>>(`/leaves/${leaveId}`);
  return data.data;
}

export async function getLeaveHistory(employeeId?: string) {
  const { data } = await http.get<ApiResponse<Leave[]>>(
    employeeId ? `/leaves/history/${employeeId}` : "/leaves/history",
  );
  return data.data;
}

export async function getLeaveAnalytics(params?: {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  groupBy?: "leaveType" | "status" | "employee";
}) {
  const { data } = await http.get<ApiResponse<LeaveAnalytics[]>>(
    "/leaves/analytics/report",
    {
      params,
    },
  );
  return data.data;
}

export async function getPendingApprovalsCount() {
  const { data } = await http.get<ApiResponse<{ pendingCount: number }>>(
    "/leaves/approvals/pending-count",
  );
  return data.data.pendingCount;
}
