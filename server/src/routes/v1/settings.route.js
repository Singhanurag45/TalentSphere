import { Router } from "express";

import {
  changePasswordController,
  createDepartmentController,
  deleteDepartmentController,
  getMeController,
  getOrganizationController,
  listDepartmentsController,
  listUsersRoleController,
  patchAdminNotificationsController,
  patchAttendancePolicyController,
  patchAvatarController,
  patchBrandingController,
  patchLeavePolicyController,
  patchOrganizationController,
  patchPreferencesController,
  patchProfileController,
  patchSecurityController,
  updateDepartmentController,
  updateUserRoleController,
} from "../../controllers/settings.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { ROLES } from "../../constants/roles.js";
import {
  changePasswordSchema,
  createDepartmentSchema,
  departmentIdSchema,
  getMeSchema,
  listDepartmentSchema,
  listUsersRoleSchema,
  patchAdminNotificationSchema,
  patchAttendancePolicySchema,
  patchAvatarSchema,
  patchBrandingSchema,
  patchLeavePolicySchema,
  patchOrganizationSchema,
  patchPreferencesSchema,
  patchProfileSchema,
  patchSecuritySchema,
  updateDepartmentSchema,
  updateUserRoleSchema,
} from "../../schemas/settings.schema.js";

export const settingsRouter = Router();

settingsRouter.use(requireAuth);

// Current user (all authenticated)
settingsRouter.get("/me", validate(getMeSchema), getMeController);
settingsRouter.patch("/me/profile", validate(patchProfileSchema), patchProfileController);
settingsRouter.post("/me/password", validate(changePasswordSchema), changePasswordController);
settingsRouter.patch("/me/preferences", validate(patchPreferencesSchema), patchPreferencesController);
settingsRouter.patch("/me/avatar", validate(patchAvatarSchema), patchAvatarController);

// Admin only
const adminOnly = authorizeRoles([ROLES.ADMIN]);

settingsRouter.get("/organization", adminOnly, getOrganizationController);
settingsRouter.patch("/organization", adminOnly, validate(patchOrganizationSchema), patchOrganizationController);
settingsRouter.patch("/organization/branding", adminOnly, validate(patchBrandingSchema), patchBrandingController);
settingsRouter.patch("/organization/attendance-policy", adminOnly, validate(patchAttendancePolicySchema), patchAttendancePolicyController);
settingsRouter.patch("/organization/leave-policy", adminOnly, validate(patchLeavePolicySchema), patchLeavePolicyController);
settingsRouter.patch("/organization/notifications", adminOnly, validate(patchAdminNotificationSchema), patchAdminNotificationsController);
settingsRouter.patch("/organization/security", adminOnly, validate(patchSecuritySchema), patchSecurityController);

settingsRouter.get("/departments", adminOnly, validate(listDepartmentSchema), listDepartmentsController);
settingsRouter.post("/departments", adminOnly, validate(createDepartmentSchema), createDepartmentController);
settingsRouter.patch(
  "/departments/:departmentId",
  adminOnly,
  validate(updateDepartmentSchema),
  updateDepartmentController,
);
settingsRouter.delete(
  "/departments/:departmentId",
  adminOnly,
  validate(departmentIdSchema),
  deleteDepartmentController,
);

settingsRouter.get("/users", adminOnly, validate(listUsersRoleSchema), listUsersRoleController);
settingsRouter.patch(
  "/users/:userId/role",
  adminOnly,
  validate(updateUserRoleSchema),
  updateUserRoleController,
);
