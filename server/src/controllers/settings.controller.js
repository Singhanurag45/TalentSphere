import { HTTP_STATUS } from "../constants/http-status.js";
import {
  changeMyPassword,
  createDepartment,
  deleteDepartment,
  getMe,
  getOrganizationSettingsAdmin,
  listDepartments,
  listUsersForRoleManagement,
  patchAttendancePolicy,
  patchBrandingSettings,
  patchLeavePolicySettings,
  patchNotificationSettingsAdmin,
  patchOrganizationSettings,
  patchSecuritySettingsAdmin,
  updateDepartment,
  updateMyAvatar,
  updateMyPreferences,
  updateMyProfile,
  updateUserRole,
} from "../services/settings.service.js";
import { apiSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getMeController = asyncHandler(async (req, res) => {
  const data = await getMe(req.auth);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Settings profile loaded", data }));
});

export const patchProfileController = asyncHandler(async (req, res) => {
  const data = await updateMyProfile(req.auth, req.body);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Profile updated", data }));
});

export const changePasswordController = asyncHandler(async (req, res) => {
  await changeMyPassword(req.auth, req.body.currentPassword, req.body.newPassword);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Password updated" }));
});

export const patchPreferencesController = asyncHandler(async (req, res) => {
  const data = await updateMyPreferences(req.auth, req.body);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Preferences saved", data }));
});

export const patchAvatarController = asyncHandler(async (req, res) => {
  const data = await updateMyAvatar(req.auth, req.body.avatarUrl);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Avatar updated", data }));
});

export const getOrganizationController = asyncHandler(async (_req, res) => {
  const data = await getOrganizationSettingsAdmin();
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Organization settings", data }));
});

export const patchOrganizationController = asyncHandler(async (req, res) => {
  const data = await patchOrganizationSettings(req.auth, req.body);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Organization updated", data }));
});

export const patchBrandingController = asyncHandler(async (req, res) => {
  const data = await patchBrandingSettings(req.auth, req.body);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Branding updated", data }));
});

export const patchAttendancePolicyController = asyncHandler(async (req, res) => {
  const data = await patchAttendancePolicy(req.auth, req.body);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Attendance policy updated", data }));
});

export const patchLeavePolicyController = asyncHandler(async (req, res) => {
  const data = await patchLeavePolicySettings(req.auth, req.body);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Leave policy updated", data }));
});

export const patchAdminNotificationsController = asyncHandler(async (req, res) => {
  const data = await patchNotificationSettingsAdmin(req.auth, req.body);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Notification settings updated", data }));
});

export const patchSecurityController = asyncHandler(async (req, res) => {
  const data = await patchSecuritySettingsAdmin(req.auth, req.body);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Security settings updated", data }));
});

export const listDepartmentsController = asyncHandler(async (_req, res) => {
  const data = await listDepartments();
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Departments", data }));
});

export const createDepartmentController = asyncHandler(async (req, res) => {
  const data = await createDepartment(req.body);
  return res.status(HTTP_STATUS.CREATED).json(apiSuccess({ message: "Department created", data }));
});

export const updateDepartmentController = asyncHandler(async (req, res) => {
  const data = await updateDepartment(req.params.departmentId, req.body);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Department updated", data }));
});

export const deleteDepartmentController = asyncHandler(async (req, res) => {
  const data = await deleteDepartment(req.params.departmentId);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Department deleted", data }));
});

export const listUsersRoleController = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = Math.min(req.query.limit || 20, 100);
  const result = await listUsersForRoleManagement({
    page,
    limit,
    search: req.query.search,
  });
  return res
    .status(HTTP_STATUS.OK)
    .json(apiSuccess({ message: "Users", data: result.items, meta: result.pagination }));
});

export const updateUserRoleController = asyncHandler(async (req, res) => {
  const data = await updateUserRole(req.auth, req.params.userId, req.body.role);
  return res.status(HTTP_STATUS.OK).json(apiSuccess({ message: "Role updated", data }));
});
