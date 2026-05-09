import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true, default: "" },
    department: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "intern"],
      default: "full-time",
    },
    status: {
      type: String,
      enum: ["active", "on-leave", "inactive"],
      default: "active",
      index: true,
    },
    dateOfJoining: { type: Date, required: true },
    managerName: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    salary: { type: Number, min: 0, default: null },
    avatarUrl: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    skills: [{ type: String, trim: true }],
    emergencyContactName: { type: String, trim: true, default: "" },
    emergencyContactPhone: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

employeeSchema.index({ firstName: 1, lastName: 1, department: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ employeeCode: 1 });

export const Employee = mongoose.model("Employee", employeeSchema);
