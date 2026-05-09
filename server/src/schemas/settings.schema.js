import { z } from "zod";

import { ROLES } from "../constants/roles.js";

export const getMeSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const patchProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(80).optional(),
    lastName: z.string().min(1).max(80).optional(),
    phone: z.string().max(30).optional(),
    emergencyContactName: z.string().max(120).optional(),
    emergencyContactPhone: z.string().max(30).optional(),
    location: z.string().max(200).optional(),
    bio: z.string().max(2000).optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1).max(128),
    newPassword: z.string().min(8).max(128),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const patchPreferencesSchema = z.object({
  body: z.object({
    theme: z.enum(["light", "dark", "system"]).optional(),
    emailLeaveUpdates: z.boolean().optional(),
    emailAttendanceSummary: z.boolean().optional(),
    emailAnnouncements: z.boolean().optional(),
    pushEnabled: z.boolean().optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const patchAvatarSchema = z.object({
  body: z.object({
    avatarUrl: z.string().min(0).max(120_000),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const patchOrganizationSchema = z.object({
  body: z.object({
    organizationName: z.string().min(1).max(200).optional(),
    legalName: z.string().max(200).optional(),
    timezone: z.string().max(80).optional(),
    address: z.string().max(500).optional(),
    supportEmail: z.union([z.string().email(), z.literal("")]).optional(),
    phone: z.string().max(40).optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const patchBrandingSchema = z.object({
  body: z.object({
    logoUrl: z.string().max(120_000).optional(),
    primaryColor: z.string().max(20).optional(),
    companyNameDisplay: z.string().max(200).optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const patchAttendancePolicySchema = z.object({
  body: z.object({
    workdayStart: z.string().max(10).optional(),
    workdayEnd: z.string().max(10).optional(),
    graceMinutesForLate: z.number().min(0).max(120).optional(),
    halfDayHours: z.number().min(0).max(12).optional(),
    requireCheckout: z.boolean().optional(),
    weekStartsOn: z.number().min(0).max(6).optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const patchLeavePolicySchema = z.object({
  body: z.object({
    fiscalYearStartMonth: z.number().min(1).max(12).optional(),
    carryForwardAnnual: z.boolean().optional(),
    maxCarryForwardDays: z.number().min(0).max(365).optional(),
    advanceNoticeDays: z.number().min(0).max(90).optional(),
    unpaidAllowed: z.boolean().optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const patchAdminNotificationSchema = z.object({
  body: z.object({
    leaveRequestSlack: z.boolean().optional(),
    leaveRequestEmail: z.boolean().optional(),
    birthdayAnnouncements: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const patchSecuritySchema = z.object({
  body: z.object({
    sessionTimeoutMinutes: z.number().min(5).max(1440).optional(),
    minPasswordLength: z.number().min(8).max(128).optional(),
    requireUppercase: z.boolean().optional(),
    requireNumber: z.boolean().optional(),
    lockoutAfterFailedAttempts: z.number().min(0).max(20).optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const listDepartmentSchema = z.object({
  query: z.object({}).default({}),
  params: z.object({}).default({}),
  body: z.object({}).default({}),
});

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(120),
    code: z.string().min(1).max(20),
    description: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const departmentIdSchema = z.object({
  params: z.object({
    departmentId: z.string().min(1),
  }),
  query: z.object({}).default({}),
  body: z.object({}).default({}),
});

export const updateDepartmentSchema = z.object({
  params: z.object({
    departmentId: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(1).max(120).optional(),
    code: z.string().min(1).max(20).optional(),
    description: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  }),
  query: z.object({}).default({}),
});

export const listUsersRoleSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
  }),
  params: z.object({}).default({}),
  body: z.object({}).default({}),
});

export const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
  body: z.object({
    role: z.enum([ROLES.ADMIN, ROLES.EMPLOYEE]),
  }),
  query: z.object({}).default({}),
});
