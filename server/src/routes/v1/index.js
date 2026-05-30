import { Router } from "express";

import { healthRouter } from "./health.route.js";
import { authRouter } from "./auth.route.js";
import { employeeRouter } from "./employee.route.js";
import { attendanceRouter } from "./attendance.route.js";
import { leaveRouter } from "./leave.route.js";
import { reportsRouter } from "./reports.route.js";
import { settingsRouter } from "./settings.route.js";
import { notificationRouter } from "./notification.route.js";

export const v1Router = Router();

v1Router.use("/health", healthRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/employees", employeeRouter);
v1Router.use("/attendance", attendanceRouter);
v1Router.use("/leaves", leaveRouter);
v1Router.use("/reports", reportsRouter);
v1Router.use("/settings", settingsRouter);
v1Router.use("/notifications", notificationRouter);
