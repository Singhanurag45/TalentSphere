import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    leaveType: {
      type: String,
      enum: [
        "annual",
        "sick",
        "casual",
        "personal",
        "unpaid",
        "maternity",
        "paternity",
      ],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    daysRequested: {
      type: Number,
      required: true,
      min: 0.5,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    comments: [
      {
        _id: false,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [
      {
        _id: false,
        fileName: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notificationsSent: [
      {
        _id: false,
        type: {
          type: String,
          enum: ["application", "approval", "rejection", "reminder"],
        },
        sentAt: Date,
        recipients: [mongoose.Schema.Types.ObjectId],
      },
    ],
  },
  { timestamps: true },
);

// Indexes for common queries
leaveSchema.index({ employee: 1, startDate: 1 });
leaveSchema.index({ employee: 1, status: 1 });
leaveSchema.index({ approvedBy: 1, status: 1 });
leaveSchema.index({ status: 1, startDate: 1 });
leaveSchema.index({ appliedAt: -1 });

export const Leave = mongoose.model("Leave", leaveSchema);
