import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    attendanceDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day", "remote", "leave"],
      required: true,
      index: true,
    },
    checkIn: { type: String, trim: true, default: "" },
    checkOut: { type: String, trim: true, default: "" },
    workHours: { type: Number, min: 0, max: 24, default: 0 },
    note: { type: String, trim: true, maxlength: 300, default: "" },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

attendanceSchema.index({ employee: 1, attendanceDate: 1 }, { unique: true });
attendanceSchema.index({ attendanceDate: 1, status: 1 });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
