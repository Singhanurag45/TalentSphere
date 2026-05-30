import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  listMyNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from "../../controllers/notification.controller.js";

export const notificationRouter = Router();

notificationRouter.use(requireAuth);

notificationRouter.get("/", listMyNotificationsController);
notificationRouter.patch("/read-all", markAllNotificationsReadController);
notificationRouter.patch("/:notificationId/read", markNotificationReadController);
