import { z } from "zod";

const statusSchema = z.enum([
  "present",
  "absent",
  "late",
  "half-day",
  "remote",
  "leave",
]);

const isoDateString = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Date must use YYYY-MM-DD format",
});

const optionalIsoDateString = isoDateString.optional().or(z.literal(""));

const timeString = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "Time must use HH:mm format",
  })
  .optional()
  .or(z.literal(""));

export const markAttendanceSchema = z.object({
  body: z.object({
    employeeId: z.string().trim().optional().or(z.literal("")),
    attendanceDate: isoDateString,
    status: statusSchema,
    checkIn: timeString,
    checkOut: timeString,
    workHours: z.coerce.number().min(0).max(24).optional().default(0),
    note: z.string().trim().max(300).optional().or(z.literal("")),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const listAttendanceSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
    employeeId: z.string().trim().optional().or(z.literal("")),
    status: statusSchema.optional().or(z.literal("")),
    startDate: optionalIsoDateString,
    endDate: optionalIsoDateString,
  }),
});

export const attendanceOverviewSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    employeeId: z.string().trim().optional().or(z.literal("")),
    month: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}$/)
      .optional(),
  }),
});
