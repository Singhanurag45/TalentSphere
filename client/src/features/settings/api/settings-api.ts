import { http } from "@/shared/api/http";

import type {
  MeSettingsResponse,
  OrganizationSettings,
} from "../types/settings";

type ApiSuccess<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
};

export async function fetchMeSettings() {
  const { data } = await http.get<ApiSuccess<MeSettingsResponse>>("/settings/me");
  return data.data;
}

export async function patchMeProfile(payload: Record<string, unknown>) {
  const { data } = await http.patch<ApiSuccess<MeSettingsResponse>>(
    "/settings/me/profile",
    payload,
  );
  return data.data;
}

export async function postChangePassword(currentPassword: string, newPassword: string) {
  await http.post("/settings/me/password", { currentPassword, newPassword });
}

export async function patchMePreferences(payload: Partial<MeSettingsResponse["user"]["preferences"]>) {
  const { data } = await http.patch<ApiSuccess<MeSettingsResponse>>(
    "/settings/me/preferences",
    payload,
  );
  return data.data;
}

export async function patchMeAvatar(avatarUrl: string) {
  const { data } = await http.patch<ApiSuccess<MeSettingsResponse>>(
    "/settings/me/avatar",
    { avatarUrl },
  );
  return data.data;
}

export async function fetchOrganizationSettings() {
  const { data } = await http.get<ApiSuccess<OrganizationSettings>>("/settings/organization");
  return data.data;
}

export async function patchOrganizationSettings(payload: Record<string, unknown>) {
  const { data } = await http.patch<ApiSuccess<OrganizationSettings>>(
    "/settings/organization",
    payload,
  );
  return data.data;
}

export async function patchBrandingSettings(payload: Record<string, unknown>) {
  const { data } = await http.patch<ApiSuccess<OrganizationSettings>>(
    "/settings/organization/branding",
    payload,
  );
  return data.data;
}

export async function patchAttendancePolicy(payload: Record<string, unknown>) {
  const { data } = await http.patch<ApiSuccess<OrganizationSettings>>(
    "/settings/organization/attendance-policy",
    payload,
  );
  return data.data;
}

export async function patchLeavePolicy(payload: Record<string, unknown>) {
  const { data } = await http.patch<ApiSuccess<OrganizationSettings>>(
    "/settings/organization/leave-policy",
    payload,
  );
  return data.data;
}

export async function patchAdminNotifications(payload: Record<string, unknown>) {
  const { data } = await http.patch<ApiSuccess<OrganizationSettings>>(
    "/settings/organization/notifications",
    payload,
  );
  return data.data;
}

export async function patchSecuritySettings(payload: Record<string, unknown>) {
  const { data } = await http.patch<ApiSuccess<OrganizationSettings>>(
    "/settings/organization/security",
    payload,
  );
  return data.data;
}

export async function fetchDepartments() {
  const { data } = await http.get<ApiSuccess<unknown[]>>("/settings/departments");
  return data.data;
}

export async function createDepartment(payload: {
  name: string;
  code: string;
  description?: string;
}) {
  const { data } = await http.post<ApiSuccess<unknown>>("/settings/departments", payload);
  return data.data;
}

export async function updateDepartment(
  departmentId: string,
  payload: Record<string, unknown>,
) {
  const { data } = await http.patch<ApiSuccess<unknown>>(
    `/settings/departments/${departmentId}`,
    payload,
  );
  return data.data;
}

export async function deleteDepartment(departmentId: string) {
  await http.delete(`/settings/departments/${departmentId}`);
}

export async function fetchUsersForRoles(page = 1, limit = 20, search?: string) {
  const { data } = await http.get<ApiSuccess<import("../types/settings").UserRoleRow[]>>(
    "/settings/users",
    { params: { page, limit, search } },
  );
  return { items: data.data, meta: data.meta as { page: number; limit: number; total: number; pages: number } };
}

export async function updateUserRole(userId: string, role: "admin" | "employee") {
  const { data } = await http.patch<ApiSuccess<unknown>>(`/settings/users/${userId}/role`, {
    role,
  });
  return data.data;
}
