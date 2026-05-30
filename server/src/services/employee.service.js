import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { ROLES } from "../constants/roles.js";
import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { HTTP_STATUS } from "../constants/http-status.js";

function sanitizeEmployee(employee) {
  return {
    id: employee.id,
    employeeCode: employee.employeeCode,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    employmentType: employee.employmentType,
    status: employee.status,
    dateOfJoining: employee.dateOfJoining,
    managerName: employee.managerName,
    location: employee.location,
    salary: employee.salary,
    avatarUrl: employee.avatarUrl,
    bio: employee.bio,
    skills: employee.skills || [],
    emergencyContactName: employee.emergencyContactName,
    emergencyContactPhone: employee.emergencyContactPhone,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function handleDuplicateError(error) {
  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "field";
    throw new ApiError(HTTP_STATUS.CONFLICT, `Duplicate value for ${field}`);
  }
  throw error;
}

export async function createEmployee(payload) {
  const { password, ...employeePayload } = payload;
  const session = await mongoose.startSession();

  try {
    let createdEmployee;

    await session.withTransaction(async () => {
      const [employee] = await Employee.create(
        [
          {
            ...employeePayload,
            employeeCode: employeePayload.employeeCode.toUpperCase(),
          },
        ],
        { session },
      );

      const passwordHash = await bcrypt.hash(password, 12);
      await User.create(
        [
          {
            firstName: employeePayload.firstName,
            lastName: employeePayload.lastName,
            email: employeePayload.email,
            passwordHash,
            role: ROLES.EMPLOYEE,
            isActive: employeePayload.status !== "inactive",
            avatarUrl: employeePayload.avatarUrl || "",
          },
        ],
        { session },
      );

      createdEmployee = employee;
    });

    return sanitizeEmployee(createdEmployee);
  } catch (error) {
    handleDuplicateError(error);
  } finally {
    await session.endSession();
  }
}

export async function updateEmployee(employeeId, payload) {
  const updates = { ...payload };
  if (updates.employeeCode) {
    updates.employeeCode = updates.employeeCode.toUpperCase();
  }

  try {
    const employee = await Employee.findByIdAndUpdate(employeeId, updates, {
      new: true,
      runValidators: true,
    }).exec();

    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");
    }

    return sanitizeEmployee(employee);
  } catch (error) {
    handleDuplicateError(error);
  }
}

export async function deleteEmployee(employeeId) {
  const employee = await Employee.findByIdAndDelete(employeeId).exec();
  if (!employee) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");
  }
}

export async function getEmployeeById(employeeId) {
  const employee = await Employee.findById(employeeId).exec();
  if (!employee) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");
  }
  return sanitizeEmployee(employee);
}

export async function listEmployees({
  page,
  limit,
  search,
  department,
  status,
}) {
  const query = {};

  if (search) {
    const safeSearch = escapeRegex(search);
    query.$or = [
      { firstName: { $regex: safeSearch, $options: "i" } },
      { lastName: { $regex: safeSearch, $options: "i" } },
      { email: { $regex: safeSearch, $options: "i" } },
      { employeeCode: { $regex: safeSearch, $options: "i" } },
      { designation: { $regex: safeSearch, $options: "i" } },
    ];
  }

  if (department) {
    query.department = {
      $regex: `^${escapeRegex(department)}$`,
      $options: "i",
    };
  }

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    Employee.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items: items.map(sanitizeEmployee),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function listEmployeeDepartments() {
  const departments = await Employee.distinct("department");
  return departments.sort((a, b) => a.localeCompare(b));
}
