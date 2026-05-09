import { Router } from "express";

import {
  applyLeaveController,
  approveLeaveController,
  rejectLeaveController,
  cancelLeaveController,
  addLeaveCommentController,
  getLeaveBalanceController,
  listLeavesController,
  getLeaveByIdController,
  getLeaveAnalyticsController,
  getPendingApprovalsController,
  getLeaveHistoryController,
} from "../../controllers/leave.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  applyLeaveSchema,
  approveLeaveSchema,
  rejectLeaveSchema,
  cancelLeaveSchema,
  addCommentSchema,
  getLeaveBalanceSchema,
  listLeavesSchema,
  leaveAnalyticsSchema,
} from "../../schemas/leave.schema.js";
import { ROLES } from "../../constants/roles.js";

export const leaveRouter = Router();

// Apply auth middleware to all routes
leaveRouter.use(requireAuth);

// Employee - Apply for leave
leaveRouter.post("/", validate(applyLeaveSchema), applyLeaveController);

// Employee - Get own leave balance
leaveRouter.get(
  "/balance",
  validate(getLeaveBalanceSchema),
  getLeaveBalanceController,
);

// Employee - Get own leave history
leaveRouter.get("/history/:employeeId?", getLeaveHistoryController);

// Admin - Get pending approvals count
leaveRouter.get("/approvals/pending-count", getPendingApprovalsController);

// Admin - Leave analytics
leaveRouter.get(
  "/analytics/report",
  requireRole([ROLES.ADMIN]),
  validate(leaveAnalyticsSchema),
  getLeaveAnalyticsController,
);

// Employee - List own/all leaves (with pagination)
leaveRouter.get("/", validate(listLeavesSchema), listLeavesController);

// Employee - Get specific leave
leaveRouter.get("/:leaveId", getLeaveByIdController);

// Employee - Cancel own leave
leaveRouter.post(
  "/:leaveId/cancel",
  validate(cancelLeaveSchema),
  cancelLeaveController,
);

// Employee - Add comment to leave
leaveRouter.post(
  "/:leaveId/comment",
  validate(addCommentSchema),
  addLeaveCommentController,
);

// Admin - Approve leave
leaveRouter.post(
  "/:leaveId/approve",
  requireRole([ROLES.ADMIN]),
  validate(approveLeaveSchema),
  approveLeaveController,
);

// Admin - Reject leave
leaveRouter.post(
  "/:leaveId/reject",
  requireRole([ROLES.ADMIN]),
  validate(rejectLeaveSchema),
  rejectLeaveController,
);
