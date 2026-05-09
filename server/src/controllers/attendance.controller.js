import { HTTP_STATUS } from "../constants/http-status.js";
import { markAttendance, listAttendance, getAttendanceOverview } from "../services/attendance.service.js";
import { apiSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const markAttendanceController = asyncHandler(async (req, res) => {
  const attendance = await markAttendance(req.body, req.auth);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Attendance marked successfully",
      data: attendance,
    }),
  );
});

export const listAttendanceController = asyncHandler(async (req, res) => {
  const result = await listAttendance(req.query, req.auth);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Attendance fetched successfully",
      data: result.items,
      meta: result.pagination,
    }),
  );
});

export const attendanceOverviewController = asyncHandler(async (req, res) => {
  const overview = await getAttendanceOverview(req.query, req.auth);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Attendance overview fetched successfully",
      data: overview,
    }),
  );
});
