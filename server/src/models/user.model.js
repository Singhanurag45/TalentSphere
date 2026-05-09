import mongoose from "mongoose";

import { ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.EMPLOYEE },
    isActive: { type: Boolean, default: true },
    avatarUrl: { type: String, trim: true, default: "" },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
      emailLeaveUpdates: { type: Boolean, default: true },
      emailAttendanceSummary: { type: Boolean, default: true },
      emailAnnouncements: { type: Boolean, default: true },
      pushEnabled: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
