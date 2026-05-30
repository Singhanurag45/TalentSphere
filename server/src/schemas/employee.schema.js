import { z } from "zod";

const employeeBodySchema = z.object({
  employeeCode: z.string().trim().min(3).max(20),
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(20).optional().or(z.literal("")),
  department: z.string().trim().min(2).max(80),
  designation: z.string().trim().min(2).max(80),
  employmentType: z.enum(["full-time", "part-time", "contract", "intern"]),
  status: z.enum(["active", "on-leave", "inactive"]),
  dateOfJoining: z.coerce.date(),
  managerName: z.string().trim().max(80).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  salary: z.coerce.number().min(0).nullable().optional(),
  avatarUrl: z.string().trim().url().optional().or(z.literal("")),
  bio: z.string().trim().max(500).optional().or(z.literal("")),
  skills: z.array(z.string().trim().min(1).max(30)).max(20).default([]),
  emergencyContactName: z.string().trim().max(80).optional().or(z.literal("")),
  emergencyContactPhone: z.string().trim().max(20).optional().or(z.literal("")),
});

export const createEmployeeSchema = z.object({
  body: employeeBodySchema.extend({
    password: z.string().min(8).max(72),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const updateEmployeeSchema = z.object({
  body: employeeBodySchema.partial(),
  params: z.object({ employeeId: z.string().trim().min(1) }),
  query: z.object({}).default({}),
});

export const listEmployeesSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: z.string().trim().max(80).optional().default(""),
    department: z.string().trim().max(80).optional().default(""),
    status: z.enum(["active", "on-leave", "inactive"]).optional(),
  }),
});

export const employeeIdSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({ employeeId: z.string().trim().min(1) }),
  query: z.object({}).default({}),
});
