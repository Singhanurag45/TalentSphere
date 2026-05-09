import { http } from "@/shared/api/http";

import type {
  Employee,
  EmployeeListFilters,
  EmployeePayload,
  PaginationMeta,
} from "../types/employee";

type ApiResponse<TData, TMeta = null> = {
  success: boolean;
  message: string;
  data: TData;
  meta: TMeta;
  error: unknown;
};

export async function fetchEmployees(filters: EmployeeListFilters) {
  const params = {
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    department: filters.department || undefined,
    status: filters.status || undefined,
  };

  const { data } = await http.get<ApiResponse<Employee[], PaginationMeta>>(
    "/employees",
    { params },
  );
  return {
    items: data.data,
    meta: data.meta,
  };
}

export async function fetchEmployeeById(employeeId: string) {
  const { data } = await http.get<ApiResponse<Employee>>(
    `/employees/${employeeId}`,
  );
  return data.data;
}

export async function fetchDepartments() {
  const { data } = await http.get<ApiResponse<string[]>>(
    "/employees/departments",
  );
  return data.data;
}

export async function createEmployee(payload: EmployeePayload) {
  const { data } = await http.post<ApiResponse<Employee>>(
    "/employees",
    payload,
  );
  return data.data;
}

export async function updateEmployee(
  employeeId: string,
  payload: Partial<EmployeePayload>,
) {
  const { data } = await http.patch<ApiResponse<Employee>>(
    `/employees/${employeeId}`,
    payload,
  );
  return data.data;
}

export async function deleteEmployee(employeeId: string) {
  await http.delete(`/employees/${employeeId}`);
}
