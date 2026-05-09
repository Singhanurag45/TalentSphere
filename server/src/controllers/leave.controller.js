import { HTTP_STATUS } from "../constants/http-status.js";
import {
  applyLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  addLeaveComment,
  getLeaveBalance,
  listLeaves,
  getLeaveById,
  getLeaveAnalytics,
  getPendingApprovalsCount,
  getLeaveHistory,
} from "../services/leave.service.js";
import { apiSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const applyLeaveController = asyncHandler(async (req, res) => {
  const leave = await applyLeave(req.body, req.auth);

  return res.status(HTTP_STATUS.CREATED).json(
    apiSuccess({
      message: "Leave application submitted successfully",
      data: leave,
    }),
  );
});

export const approveLeaveController = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;
  const { comment } = req.body;

  const leave = await approveLeave(leaveId, req.auth, comment);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Leave approved successfully",
      data: leave,
    }),
  );
});

export const rejectLeaveController = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;
  const { rejectionReason } = req.body;

  const leave = await rejectLeave(leaveId, req.auth, rejectionReason);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Leave rejected successfully",
      data: leave,
    }),
  );
});

export const cancelLeaveController = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;
  const { reason } = req.body;

  const leave = await cancelLeave(leaveId, req.auth, reason);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Leave cancelled successfully",
      data: leave,
    }),
  );
});

export const addLeaveCommentController = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;
  const { text } = req.body;

  const leave = await addLeaveComment(leaveId, req.auth, text);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Comment added successfully",
      data: leave,
    }),
  );
});

export const getLeaveBalanceController = asyncHandler(async (req, res) => {
  const { employeeId, fiscalYear } = req.query;

  const balance = await getLeaveBalance(employeeId || req.auth.email, fiscalYear);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Leave balance fetched successfully",
      data: balance,
    }),
  );
});

export const listLeavesController = asyncHandler(async (req, res) => {
  const result = await listLeaves(req.query, req.auth);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Leave applications fetched successfully",
      data: result.items,
      meta: result.pagination,
    }),
  );
});

export const getLeaveByIdController = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;

  const leave = await getLeaveById(leaveId, req.auth);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Leave application fetched successfully",
      data: leave,
    }),
  );
});

export const getLeaveAnalyticsController = asyncHandler(async (req, res) => {
  const analytics = await getLeaveAnalytics(req.query);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Leave analytics fetched successfully",
      data: analytics,
    }),
  );
});

export const getPendingApprovalsController = asyncHandler(async (req, res) => {
  const count = await getPendingApprovalsCount(req.auth);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Pending approvals count fetched successfully",
      data: { pendingCount: count },
    }),
  );
});

export const getLeaveHistoryController = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const history = await getLeaveHistory(employeeId || req.auth.email);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Leave history fetched successfully",
      data: history,
    }),
  );
});
