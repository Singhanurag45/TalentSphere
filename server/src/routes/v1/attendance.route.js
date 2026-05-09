import { Router } from "express";

import {
  attendanceOverviewController,
  listAttendanceController,
  markAttendanceController,
} from "../../controllers/attendance.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  attendanceOverviewSchema,
  listAttendanceSchema,
  markAttendanceSchema,
} from "../../schemas/attendance.schema.js";

export const attendanceRouter = Router();

attendanceRouter.use(requireAuth);

attendanceRouter.get("/", validate(listAttendanceSchema), listAttendanceController);
attendanceRouter.get(
  "/overview",
  validate(attendanceOverviewSchema),
  attendanceOverviewController,
);
attendanceRouter.post("/", validate(markAttendanceSchema), markAttendanceController);
