import { z } from "zod";

const leaveTypeEnum = z.enum([
  "annual",
  "sick",
  "casual",
  "personal",
  "unpaid",
  "maternity",
  "paternity",
]);

const leaveStatusEnum = z.enum([
  "pending",
  "approved",
  "rejected",
  "cancelled",
]);

export const applyLeaveSchema = z.object({
  body: z.object({
    leaveType: leaveTypeEnum,
    startDate: z.string().datetime().or(z.string().date()),
    endDate: z.string().datetime().or(z.string().date()),
    daysRequested: z.number().positive().min(0.5),
    reason: z.string().min(10).max(1000),
    attachments: z
      .array(
        z.object({
          fileName: z.string(),
          fileUrl: z.string().url(),
        }),
      )
      .optional(),
  }),
});

export const approveLeaveSchema = z.object({
  params: z.object({
    leaveId: z.string().min(1),
  }),
  body: z.object({
    comment: z.string().max(500).optional(),
  }),
});

export const rejectLeaveSchema = z.object({
  params: z.object({
    leaveId: z.string().min(1),
  }),
  body: z.object({
    rejectionReason: z.string().min(10).max(500),
  }),
});

export const cancelLeaveSchema = z.object({
  params: z.object({
    leaveId: z.string().min(1),
  }),
  body: z.object({
    reason: z.string().min(5).max(500).optional(),
  }),
});

export const addCommentSchema = z.object({
  params: z.object({
    leaveId: z.string().min(1),
  }),
  body: z.object({
    text: z.string().min(1).max(500),
  }),
});

export const getLeaveBalanceSchema = z.object({
  query: z.object({
    employeeId: z.string().optional(),
    fiscalYear: z.string().optional(),
  }),
});

export const listLeavesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: leaveStatusEnum.optional(),
    leaveType: leaveTypeEnum.optional(),
    employeeId: z.string().optional(),
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
  }),
});

export const leaveAnalyticsSchema = z.object({
  query: z.object({
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
    departmentId: z.string().optional(),
    groupBy: z.enum(["leaveType", "status", "employee"]).optional(),
  }),
});
