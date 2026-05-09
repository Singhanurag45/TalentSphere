import { HTTP_STATUS } from "../constants/http-status.js";
import { Leave } from "../models/leave.model.js";
import { LeaveBalance } from "../models/leave-balance.model.js";
import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ROLES } from "../constants/roles.js";

function getAuthUserId(authUser) {
  return authUser?.sub || authUser?.id;
}

function getCurrentFiscalYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Assuming fiscal year starts in April
  if (month >= 3) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

function calculateBusinessDays(startDate, endDate) {
  let count = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count;
}

async function getOrCreateLeaveBalance(employeeId, fiscalYear) {
  let balance = await LeaveBalance.findOne({
    employee: employeeId,
    fiscal_year: fiscalYear,
  });

  if (!balance) {
    balance = await LeaveBalance.create({
      employee: employeeId,
      fiscal_year: fiscalYear,
    });
  }

  return balance;
}

export async function applyLeave(payload, authUser) {
  const {
    leaveType,
    startDate,
    endDate,
    daysRequested,
    reason,
    attachments = [],
  } = payload;

  // Validate date range
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Start date must be before end date",
    );
  }

  if (start < new Date()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Cannot apply for past leaves");
  }

  // Get employee record
  const employee = await Employee.findOne({ email: authUser.email });
  if (!employee) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee record not found");
  }

  // Check leave balance
  const fiscalYear = getCurrentFiscalYear();
  const balance = await getOrCreateLeaveBalance(employee._id, fiscalYear);

  const leaveTypeBalance = balance.leaveTypes[leaveType];
  if (!leaveTypeBalance) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid leave type");
  }

  const availableBalance =
    leaveTypeBalance.allocated -
    leaveTypeBalance.used -
    leaveTypeBalance.pending;

  if (leaveType !== "unpaid" && availableBalance < daysRequested) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Insufficient ${leaveType} leave balance. Available: ${availableBalance} days`,
    );
  }

  // Check for overlapping leaves
  const overlappingLeaves = await Leave.find({
    employee: employee._id,
    status: { $in: ["pending", "approved"] },
    startDate: { $lt: end },
    endDate: { $gt: start },
  });

  if (overlappingLeaves.length > 0) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "You have overlapping leave applications",
    );
  }

  // Create leave record
  const leave = await Leave.create({
    employee: employee._id,
    leaveType,
    startDate: start,
    endDate: end,
    daysRequested,
    reason,
    appliedBy: getAuthUserId(authUser),
    attachments: attachments.map((att) => ({
      fileName: att.fileName,
      fileUrl: att.fileUrl,
    })),
    notificationsSent: [
      {
        type: "application",
        sentAt: new Date(),
        recipients: [], // Will be populated by notification service
      },
    ],
  });

  // Update pending balance
  await LeaveBalance.updateOne(
    { _id: balance._id },
    {
      $inc: {
        [`leaveTypes.${leaveType}.pending`]: daysRequested,
      },
      lastUpdated: new Date(),
    },
  );

  return leave.populate("employee appliedBy approvedBy").exec();
}

export async function approveLeave(leaveId, approverUser, comment) {
  const leave = await Leave.findById(leaveId).populate("employee");

  if (!leave) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Leave request not found");
  }

  if (leave.status !== "pending") {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Cannot approve a ${leave.status} leave`,
    );
  }

  // Update leave
  leave.status = "approved";
  leave.approvedAt = new Date();
  leave.approvedBy = getAuthUserId(approverUser);

  if (comment) {
    leave.comments.push({
      author: getAuthUserId(approverUser),
      text: comment,
      createdAt: new Date(),
    });
  }

  await leave.save();

  // Update leave balance - move from pending to used
  const fiscalYear = getCurrentFiscalYear();
  await LeaveBalance.updateOne(
    { employee: leave.employee._id, fiscal_year: fiscalYear },
    {
      $inc: {
        [`leaveTypes.${leave.leaveType}.pending`]: -leave.daysRequested,
        [`leaveTypes.${leave.leaveType}.used`]: leave.daysRequested,
      },
      lastUpdated: new Date(),
      updatedBy: getAuthUserId(approverUser),
    },
  );

  return leave.populate("employee appliedBy approvedBy").exec();
}

export async function rejectLeave(leaveId, approverUser, rejectionReason) {
  const leave = await Leave.findById(leaveId).populate("employee");

  if (!leave) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Leave request not found");
  }

  if (leave.status !== "pending") {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Cannot reject a ${leave.status} leave`,
    );
  }

  leave.status = "rejected";
  leave.approvedAt = new Date();
  leave.approvedBy = getAuthUserId(approverUser);
  leave.rejectionReason = rejectionReason;

  await leave.save();

  // Update leave balance - move from pending back to available
  const fiscalYear = getCurrentFiscalYear();
  await LeaveBalance.updateOne(
    { employee: leave.employee._id, fiscal_year: fiscalYear },
    {
      $inc: {
        [`leaveTypes.${leave.leaveType}.pending`]: -leave.daysRequested,
      },
      lastUpdated: new Date(),
      updatedBy: getAuthUserId(approverUser),
    },
  );

  return leave.populate("employee appliedBy approvedBy").exec();
}

export async function cancelLeave(leaveId, requesterUser, reason) {
  const leave = await Leave.findById(leaveId).populate("employee");

  if (!leave) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Leave request not found");
  }

  // Only applicant or admin can cancel
  if (
    leave.appliedBy.toString() !== getAuthUserId(requesterUser) &&
    requesterUser.role !== ROLES.ADMIN
  ) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Not authorized to cancel this leave",
    );
  }

  if (!["pending", "approved"].includes(leave.status)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Cannot cancel a ${leave.status} leave`,
    );
  }

  const wasApproved = leave.status === "approved";
  leave.status = "cancelled";

  if (reason) {
    leave.comments.push({
      author: getAuthUserId(requesterUser),
      text: `Cancellation reason: ${reason}`,
      createdAt: new Date(),
    });
  }

  await leave.save();

  // Update leave balance
  const fiscalYear = getCurrentFiscalYear();
  const updateData = {};

  if (wasApproved) {
    updateData[`leaveTypes.${leave.leaveType}.used`] = -leave.daysRequested;
  } else {
    updateData[`leaveTypes.${leave.leaveType}.pending`] = -leave.daysRequested;
  }

  await LeaveBalance.updateOne(
    { employee: leave.employee._id, fiscal_year: fiscalYear },
    {
      $inc: updateData,
      lastUpdated: new Date(),
    },
  );

  return leave.populate("employee appliedBy approvedBy").exec();
}

export async function addLeaveComment(leaveId, authorUser, commentText) {
  const leave = await Leave.findById(leaveId);

  if (!leave) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Leave request not found");
  }

  leave.comments.push({
    author: getAuthUserId(authorUser),
    text: commentText,
    createdAt: new Date(),
  });

  await leave.save();

  return leave.populate({
    path: "comments.author",
    select: "firstName lastName email",
  });
}

export async function getLeaveBalance(employeeId, fiscalYear) {
  const balance = await LeaveBalance.findOne({
    employee: employeeId,
    fiscal_year: fiscalYear || getCurrentFiscalYear(),
  }).populate("employee");

  if (!balance) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Leave balance not found");
  }

  return balance;
}

export async function listLeaves(query, authUser) {
  const {
    page = 1,
    limit = 10,
    status,
    leaveType,
    employeeId,
    startDate,
    endDate,
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  if (status) filter.status = status;
  if (leaveType) filter.leaveType = leaveType;

  // Permission check - employees can only see their own leaves
  if (authUser.role === ROLES.EMPLOYEE) {
    const employee = await Employee.findOne({ email: authUser.email }).select("_id");
    if (!employee) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "No employee profile is linked to this user",
      );
    }
    filter.employee = employee._id;
  } else if (employeeId) {
    filter.employee = employeeId;
  }

  if (startDate || endDate) {
    filter.startDate = {};
    if (startDate) filter.startDate.$gte = new Date(startDate);
    if (endDate) filter.startDate.$lte = new Date(endDate);
  }

  const total = await Leave.countDocuments(filter);
  const items = await Leave.find(filter)
    .populate("employee appliedBy approvedBy", "firstName lastName email")
    .sort({ appliedAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function getLeaveById(leaveId, authUser) {
  const leave = await Leave.findById(leaveId).populate(
    "employee appliedBy approvedBy comments.author",
  );

  if (!leave) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Leave request not found");
  }

  // Permission check
  if (
    authUser.role === ROLES.EMPLOYEE &&
    leave.appliedBy.toString() !== getAuthUserId(authUser)
  ) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "Not authorized to view this leave",
    );
  }

  return leave;
}

export async function getLeaveAnalytics(query) {
  const { startDate, endDate, departmentId, groupBy = "leaveType" } = query;

  const matchStage = {
    status: "approved",
  };

  if (startDate || endDate) {
    matchStage.startDate = {};
    if (startDate) matchStage.startDate.$gte = new Date(startDate);
    if (endDate) matchStage.startDate.$lte = new Date(endDate);
  }

  if (departmentId) {
    matchStage.department = departmentId;
  }

  const groupStage = {
    _id: `$${groupBy}`,
    totalDays: { $sum: "$daysRequested" },
    count: { $sum: 1 },
  };

  if (groupBy === "employee") {
    groupStage._id = "$employee";
    matchStage.employee = { $exists: true };
  }

  const pipeline = [
    { $match: matchStage },
    { $group: groupStage },
    { $sort: { count: -1 } },
  ];

  const analytics = await Leave.aggregate(pipeline);

  return analytics;
}

export async function getPendingApprovalsCount(adminUser) {
  // Get all admin/manager users who can approve
  return Leave.countDocuments({ status: "pending" });
}

export async function getLeaveHistory(employeeId) {
  const employee = await Employee.findOne({ email: employeeId }).select("_id");
  const employeeFilterId = employee?._id || employeeId;

  return Leave.find({ employee: employeeFilterId })
    .populate("appliedBy approvedBy", "firstName lastName")
    .sort({ appliedAt: -1 })
    .exec();
}
