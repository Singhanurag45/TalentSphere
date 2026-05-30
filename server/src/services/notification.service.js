import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { ROLES } from "../constants/roles.js";

function getAuthUserId(authUser) {
  return authUser?.sub || authUser?.id;
}

export async function createNotification(payload) {
  if (!payload.recipient) return null;
  return Notification.create(payload);
}

export async function notifyAdminsOfLeaveRequest(leave) {
  const admins = await User.find({ role: ROLES.ADMIN, isActive: true }).select("_id");
  if (!admins.length) return [];

  const employeeName = `${leave.employee?.firstName ?? "An employee"} ${leave.employee?.lastName ?? ""}`.trim();

  return Notification.insertMany(
    admins.map((admin) => ({
      recipient: admin._id,
      title: "New leave request",
      message: `${employeeName} requested ${leave.daysRequested} day${leave.daysRequested === 1 ? "" : "s"} of leave.`,
      type: "leave_request",
      link: "/leaves/approvals",
    })),
  );
}

export async function notifyEmployeeLeaveDecision(leave, status) {
  const employeeUser = await User.findOne({ email: leave.employee?.email }).select("_id");
  if (!employeeUser) return null;

  const approved = status === "approved";
  return createNotification({
    recipient: employeeUser._id,
    title: approved ? "Leave approved" : "Leave rejected",
    message: `Your ${leave.daysRequested} day${leave.daysRequested === 1 ? "" : "s"} leave request was ${status}.`,
    type: approved ? "leave_approved" : "leave_rejected",
    link: "/leaves/history",
  });
}

export async function listMyNotifications(authUser, query = {}) {
  const limit = Math.min(Number(query.limit) || 10, 50);
  const filter = { recipient: getAuthUserId(authUser) };
  if (query.unreadOnly === "true") filter.readAt = null;

  const [items, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
    Notification.countDocuments({ recipient: getAuthUserId(authUser), readAt: null }),
  ]);

  return { items, unreadCount };
}

export async function markNotificationRead(notificationId, authUser) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: getAuthUserId(authUser) },
    { readAt: new Date() },
    { new: true },
  );
}

export async function markAllNotificationsRead(authUser) {
  await Notification.updateMany(
    { recipient: getAuthUserId(authUser), readAt: null },
    { readAt: new Date() },
  );
}
