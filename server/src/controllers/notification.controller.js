import { HTTP_STATUS } from "../constants/http-status.js";
import { apiSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notification.service.js";

export const listMyNotificationsController = asyncHandler(async (req, res) => {
  const result = await listMyNotifications(req.auth, req.query);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Notifications fetched successfully",
      data: result.items,
      meta: { unreadCount: result.unreadCount },
    }),
  );
});

export const markNotificationReadController = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead(req.params.notificationId, req.auth);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Notification marked as read",
      data: notification,
    }),
  );
});

export const markAllNotificationsReadController = asyncHandler(async (req, res) => {
  await markAllNotificationsRead(req.auth);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Notifications marked as read",
      data: { ok: true },
    }),
  );
});
