import mongoose from "mongoose";

import { ROLES } from "../constants/roles.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { Attendance } from "../models/attendance.model.js";
import { Employee } from "../models/employee.model.js";
import { ApiError } from "../utils/api-error.js";

const STATUS_LABELS = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  "half-day": "Half Day",
  remote: "Remote",
  leave: "Leave",
};

function toDayStart(value) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, "Invalid date");
  }
  return date;
}

function toDayEnd(value) {
  const date = new Date(`${value}T23:59:59.999Z`);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, "Invalid date");
  }
  return date;
}

function getMonthRange(month) {
  const [year, monthIndex] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));
  return { start, end };
}

function currentMonth() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function sanitizeAttendance(record) {
  const employee = record.employee || {};
  return {
    id: record._id.toString(),
    employee: {
      id: employee._id?.toString() || employee.id,
      employeeCode: employee.employeeCode,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
    },
    attendanceDate: record.attendanceDate,
    status: record.status,
    checkIn: record.checkIn,
    checkOut: record.checkOut,
    workHours: record.workHours,
    note: record.note,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

async function resolveEmployeeAccess(auth, requestedEmployeeId) {
  if (auth.role === ROLES.ADMIN) {
    if (!requestedEmployeeId) return null;
    const employee = await Employee.findById(requestedEmployeeId).select("_id").lean();
    if (!employee) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");
    return employee._id;
  }

  const employee = await Employee.findOne({ email: auth.email }).select("_id").lean();
  if (!employee) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "No employee profile is linked to this user");
  }

  if (requestedEmployeeId && requestedEmployeeId !== employee._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "You can only access your own attendance");
  }

  return employee._id;
}

function buildDateQuery({ startDate, endDate }) {
  const query = {};
  if (startDate || endDate) {
    query.attendanceDate = {};
    if (startDate) query.attendanceDate.$gte = toDayStart(startDate);
    if (endDate) query.attendanceDate.$lte = toDayEnd(endDate);
  }
  return query;
}

export async function markAttendance(payload, auth) {
  const employeeId = await resolveEmployeeAccess(auth, payload.employeeId);
  const attendanceDate = toDayStart(payload.attendanceDate);

  try {
    const record = await Attendance.findOneAndUpdate(
      { employee: employeeId, attendanceDate },
      {
        $set: {
          employee: employeeId,
          attendanceDate,
          status: payload.status,
          checkIn: payload.checkIn || "",
          checkOut: payload.checkOut || "",
          workHours: payload.workHours || 0,
          note: payload.note || "",
          markedBy: auth.sub,
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    )
      .populate("employee", "employeeCode firstName lastName email department designation")
      .exec();

    return sanitizeAttendance(record);
  } catch (error) {
    if (error?.code === 11000) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Attendance is already marked for this date");
    }
    throw error;
  }
}

export async function listAttendance(filters, auth) {
  const employeeId = await resolveEmployeeAccess(auth, filters.employeeId);
  const query = buildDateQuery(filters);

  if (employeeId) query.employee = employeeId;
  if (filters.status) query.status = filters.status;

  const skip = (filters.page - 1) * filters.limit;
  const [items, total] = await Promise.all([
    Attendance.find(query)
      .populate("employee", "employeeCode firstName lastName email department designation")
      .sort({ attendanceDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(filters.limit)
      .exec(),
    Attendance.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / filters.limit));

  return {
    items: items.map(sanitizeAttendance),
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages,
      hasNextPage: filters.page < totalPages,
      hasPrevPage: filters.page > 1,
    },
  };
}

export async function getAttendanceOverview(filters, auth) {
  const month = filters.month || currentMonth();
  const { start, end } = getMonthRange(month);
  const employeeId = await resolveEmployeeAccess(auth, filters.employeeId);
  const match = { attendanceDate: { $gte: start, $lt: end } };
  if (employeeId) match.employee = new mongoose.Types.ObjectId(employeeId);

  const [statusRows, dailyRows, employeeRows, recentRecords] = await Promise.all([
    Attendance.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 }, workHours: { $sum: "$workHours" } } },
      { $sort: { count: -1 } },
    ]),
    Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { date: "$attendanceDate", format: "%Y-%m-%d" } },
          present: {
            $sum: { $cond: [{ $in: ["$status", ["present", "late", "remote", "half-day"]] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $in: ["$status", ["absent", "leave"]] }, 1, 0] },
          },
          late: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$employee",
          present: {
            $sum: { $cond: [{ $in: ["$status", ["present", "late", "remote", "half-day"]] }, 1, 0] },
          },
          absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } },
          workHours: { $sum: "$workHours" },
          total: { $sum: 1 },
        },
      },
      { $sort: { present: -1, workHours: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
    ]),
    Attendance.find(match)
      .populate("employee", "employeeCode firstName lastName email department designation")
      .sort({ attendanceDate: -1, updatedAt: -1 })
      .limit(8)
      .exec(),
  ]);

  const totals = statusRows.reduce(
    (acc, row) => {
      acc.records += row.count;
      acc.workHours += row.workHours;
      if (["present", "late", "remote", "half-day"].includes(row._id)) acc.present += row.count;
      if (row._id === "absent") acc.absent += row.count;
      if (row._id === "late") acc.late += row.count;
      if (row._id === "leave") acc.leave += row.count;
      return acc;
    },
    { records: 0, present: 0, absent: 0, late: 0, leave: 0, workHours: 0 },
  );

  return {
    month,
    summary: {
      ...totals,
      attendanceRate: totals.records ? Math.round((totals.present / totals.records) * 100) : 0,
    },
    byStatus: statusRows.map((row) => ({
      status: row._id,
      label: STATUS_LABELS[row._id] || row._id,
      count: row.count,
      workHours: row.workHours,
    })),
    dailyTrend: dailyRows.map((row) => ({
      date: row._id,
      present: row.present,
      absent: row.absent,
      late: row.late,
    })),
    employeeBreakdown: employeeRows.map((row) => ({
      employeeId: row._id.toString(),
      employeeName: `${row.employee.firstName} ${row.employee.lastName}`,
      employeeCode: row.employee.employeeCode,
      department: row.employee.department,
      present: row.present,
      absent: row.absent,
      late: row.late,
      workHours: row.workHours,
      attendanceRate: row.total ? Math.round((row.present / row.total) * 100) : 0,
    })),
    recent: recentRecords.map(sanitizeAttendance),
  };
}
