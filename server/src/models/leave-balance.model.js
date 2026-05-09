import mongoose from "mongoose";

const leaveBalanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    fiscal_year: {
      type: String, // Format: "2024-2025"
      required: true,
      index: true,
    },
    leaveTypes: {
      annual: {
        allocated: { type: Number, default: 20 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        carried_over: { type: Number, default: 0 },
      },
      sick: {
        allocated: { type: Number, default: 12 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        carried_over: { type: Number, default: 0 },
      },
      casual: {
        allocated: { type: Number, default: 8 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        carried_over: { type: Number, default: 0 },
      },
      personal: {
        allocated: { type: Number, default: 2 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        carried_over: { type: Number, default: 0 },
      },
      unpaid: {
        allocated: { type: Number, default: 0 }, // Unlimited
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        carried_over: { type: Number, default: 0 },
      },
      maternity: {
        allocated: { type: Number, default: 180 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        carried_over: { type: Number, default: 0 },
      },
      paternity: {
        allocated: { type: Number, default: 10 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        carried_over: { type: Number, default: 0 },
      },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// Compound index for fiscal year query
leaveBalanceSchema.index({ employee: 1, fiscal_year: 1 }, { unique: true });

export const LeaveBalance = mongoose.model("LeaveBalance", leaveBalanceSchema);
