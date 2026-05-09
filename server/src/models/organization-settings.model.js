import mongoose from "mongoose";

const organizationSettingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, unique: true, default: "default" },

    organizationName: { type: String, trim: true, default: "Organization" },
    legalName: { type: String, trim: true, default: "" },
    timezone: { type: String, trim: true, default: "Asia/Kolkata" },
    address: { type: String, trim: true, default: "" },
    supportEmail: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },

    branding: {
      logoUrl: { type: String, trim: true, default: "" },
      primaryColor: { type: String, trim: true, default: "#4f46e5" },
      companyNameDisplay: { type: String, trim: true, default: "" },
    },

    attendancePolicy: {
      workdayStart: { type: String, default: "09:30" },
      workdayEnd: { type: String, default: "18:30" },
      graceMinutesForLate: { type: Number, min: 0, max: 120, default: 15 },
      halfDayHours: { type: Number, min: 0, max: 12, default: 4 },
      requireCheckout: { type: Boolean, default: false },
      weekStartsOn: {
        type: Number,
        min: 0,
        max: 6,
        default: 1,
      },
    },

    leavePolicy: {
      fiscalYearStartMonth: { type: Number, min: 1, max: 12, default: 4 },
      carryForwardAnnual: { type: Boolean, default: true },
      maxCarryForwardDays: { type: Number, min: 0, default: 5 },
      advanceNoticeDays: { type: Number, min: 0, default: 1 },
      unpaidAllowed: { type: Boolean, default: true },
    },

    notificationSettings: {
      leaveRequestSlack: { type: Boolean, default: false },
      leaveRequestEmail: { type: Boolean, default: true },
      birthdayAnnouncements: { type: Boolean, default: false },
      weeklyDigest: { type: Boolean, default: true },
    },

    securitySettings: {
      sessionTimeoutMinutes: { type: Number, min: 5, max: 1440, default: 480 },
      minPasswordLength: { type: Number, min: 8, max: 128, default: 8 },
      requireUppercase: { type: Boolean, default: true },
      requireNumber: { type: Boolean, default: true },
      lockoutAfterFailedAttempts: { type: Number, min: 0, max: 20, default: 5 },
    },
  },
  { timestamps: true },
);

export const OrganizationSettings = mongoose.model(
  "OrganizationSettings",
  organizationSettingsSchema,
);
