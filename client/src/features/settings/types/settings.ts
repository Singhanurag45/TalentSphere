export type UserPreferences = {
  theme: "light" | "dark" | "system";
  emailLeaveUpdates: boolean;
  emailAttendanceSummary: boolean;
  emailAnnouncements: boolean;
  pushEnabled: boolean;
};

export type MeSettingsUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string;
  preferences: UserPreferences;
};

export type MeSettingsEmployee = {
  id: string;
  employeeCode: string;
  phone: string;
  department: string;
  designation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  location: string;
  bio: string;
} | null;

export type MeSettingsResponse = {
  user: MeSettingsUser;
  employee: MeSettingsEmployee;
};

export type OrganizationSettings = {
  organizationName: string;
  legalName: string;
  timezone: string;
  address: string;
  supportEmail: string;
  phone: string;
  branding: {
    logoUrl: string;
    primaryColor: string;
    companyNameDisplay: string;
  };
  attendancePolicy: {
    workdayStart: string;
    workdayEnd: string;
    graceMinutesForLate: number;
    halfDayHours: number;
    requireCheckout: boolean;
    weekStartsOn: number;
  };
  leavePolicy: {
    fiscalYearStartMonth: number;
    carryForwardAnnual: boolean;
    maxCarryForwardDays: number;
    advanceNoticeDays: number;
    unpaidAllowed: boolean;
  };
  notificationSettings: {
    leaveRequestSlack: boolean;
    leaveRequestEmail: boolean;
    birthdayAnnouncements: boolean;
    weeklyDigest: boolean;
  };
  securitySettings: {
    sessionTimeoutMinutes: number;
    minPasswordLength: number;
    requireUppercase: boolean;
    requireNumber: boolean;
    lockoutAfterFailedAttempts: number;
  };
};

export type DepartmentRow = {
  _id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
};

export type UserRoleRow = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
};
