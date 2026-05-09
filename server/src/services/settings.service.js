import bcrypt from "bcryptjs";

import { HTTP_STATUS } from "../constants/http-status.js";
import { ROLES } from "../constants/roles.js";
import { Department } from "../models/department.model.js";
import { Employee } from "../models/employee.model.js";
import { OrganizationSettings } from "../models/organization-settings.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";

function sanitizeUserPublic(user) {
  const p = user.preferences || {};
  return {
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    avatarUrl: user.avatarUrl || "",
    preferences: {
      theme: p.theme ?? "system",
      emailLeaveUpdates: p.emailLeaveUpdates !== false,
      emailAttendanceSummary: p.emailAttendanceSummary !== false,
      emailAnnouncements: p.emailAnnouncements !== false,
      pushEnabled: Boolean(p.pushEnabled),
    },
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getOrCreateOrgSettings() {
  let doc = await OrganizationSettings.findOne({ singletonKey: "default" });
  if (!doc) {
    doc = await OrganizationSettings.create({ singletonKey: "default" });
  }
  return doc;
}

export async function getMe(auth) {
  const user = await User.findById(auth.sub).lean();
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }

  const employee = await Employee.findOne({ email: user.email }).lean();

  return {
    user: sanitizeUserPublic(user),
    employee: employee
      ? {
          id: employee._id.toString(),
          employeeCode: employee.employeeCode,
          phone: employee.phone,
          department: employee.department,
          designation: employee.designation,
          emergencyContactName: employee.emergencyContactName,
          emergencyContactPhone: employee.emergencyContactPhone,
          location: employee.location,
          bio: employee.bio,
        }
      : null,
  };
}

export async function updateMyProfile(auth, payload) {
  const user = await User.findById(auth.sub);
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");

  if (payload.firstName !== undefined) user.firstName = payload.firstName;
  if (payload.lastName !== undefined) user.lastName = payload.lastName;

  const employee = await Employee.findOne({ email: user.email });

  if (employee) {
    if (payload.phone !== undefined) employee.phone = payload.phone;
    if (payload.emergencyContactName !== undefined) {
      employee.emergencyContactName = payload.emergencyContactName;
    }
    if (payload.emergencyContactPhone !== undefined) {
      employee.emergencyContactPhone = payload.emergencyContactPhone;
    }
    if (payload.location !== undefined) employee.location = payload.location;
    if (payload.bio !== undefined) employee.bio = payload.bio;
    if (payload.firstName !== undefined) employee.firstName = payload.firstName;
    if (payload.lastName !== undefined) employee.lastName = payload.lastName;
    await employee.save();
  }

  await user.save();
  return getMe(auth);
}

const MAX_AVATAR_LENGTH = 120_000;

export async function updateMyAvatar(auth, avatarUrl) {
  if (avatarUrl.length > MAX_AVATAR_LENGTH) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Avatar payload too large");
  }
  const user = await User.findById(auth.sub);
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  user.avatarUrl = avatarUrl;
  await user.save();

  const employee = await Employee.findOne({ email: user.email });
  if (employee) {
    employee.avatarUrl = avatarUrl;
    await employee.save();
  }

  return getMe(auth);
}

export async function changeMyPassword(auth, currentPassword, newPassword) {
  const user = await User.findById(auth.sub);
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Current password is incorrect");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();
  return { ok: true };
}

export async function updateMyPreferences(auth, preferences) {
  const user = await User.findById(auth.sub);
  if (!user) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");

  if (!user.preferences) user.preferences = {};
  Object.assign(user.preferences, preferences);
  user.markModified("preferences");
  await user.save();
  return getMe(auth);
}

export async function getOrganizationSettingsAdmin() {
  const doc = await getOrCreateOrgSettings();
  return doc.toObject();
}

export async function patchOrganizationSettings(_auth, patch) {
  const doc = await getOrCreateOrgSettings();
  const allowedRoots = [
    "organizationName",
    "legalName",
    "timezone",
    "address",
    "supportEmail",
    "phone",
  ];
  for (const key of allowedRoots) {
    if (patch[key] !== undefined) doc[key] = patch[key];
  }
  await doc.save();
  return doc.toObject();
}

export async function patchBrandingSettings(_auth, branding) {
  const doc = await getOrCreateOrgSettings();
  Object.assign(doc.branding, branding);
  doc.markModified("branding");
  await doc.save();
  return doc.toObject();
}

export async function patchAttendancePolicy(_auth, policy) {
  const doc = await getOrCreateOrgSettings();
  Object.assign(doc.attendancePolicy, policy);
  doc.markModified("attendancePolicy");
  await doc.save();
  return doc.toObject();
}

export async function patchLeavePolicySettings(_auth, policy) {
  const doc = await getOrCreateOrgSettings();
  Object.assign(doc.leavePolicy, policy);
  doc.markModified("leavePolicy");
  await doc.save();
  return doc.toObject();
}

export async function patchNotificationSettingsAdmin(_auth, settings) {
  const doc = await getOrCreateOrgSettings();
  Object.assign(doc.notificationSettings, settings);
  doc.markModified("notificationSettings");
  await doc.save();
  return doc.toObject();
}

export async function patchSecuritySettingsAdmin(_auth, settings) {
  const doc = await getOrCreateOrgSettings();
  Object.assign(doc.securitySettings, settings);
  doc.markModified("securitySettings");
  await doc.save();
  return doc.toObject();
}

export async function listDepartments() {
  return Department.find().sort({ sortOrder: 1, name: 1 }).lean();
}

export async function createDepartment(payload) {
  try {
    const dep = await Department.create({
      name: payload.name,
      code: payload.code.toUpperCase(),
      description: payload.description || "",
      isActive: payload.isActive !== false,
      sortOrder: payload.sortOrder ?? 0,
    });
    return dep.toObject();
  } catch (e) {
    if (e?.code === 11000) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Department code already exists");
    }
    throw e;
  }
}

export async function updateDepartment(id, payload) {
  const dep = await Department.findById(id);
  if (!dep) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Department not found");
  if (payload.name !== undefined) dep.name = payload.name;
  if (payload.code !== undefined) dep.code = payload.code.toUpperCase();
  if (payload.description !== undefined) dep.description = payload.description;
  if (payload.isActive !== undefined) dep.isActive = payload.isActive;
  if (payload.sortOrder !== undefined) dep.sortOrder = payload.sortOrder;
  try {
    await dep.save();
  } catch (e) {
    if (e?.code === 11000) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Department code already exists");
    }
    throw e;
  }
  return dep.toObject();
}

export async function deleteDepartment(id) {
  const dep = await Department.findByIdAndDelete(id);
  if (!dep) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Department not found");
  return { deleted: true };
}

export async function listUsersForRoleManagement({ page, limit, search }) {
  const skip = (page - 1) * limit;
  const filter = {};
  if (search?.trim()) {
    const rx = new RegExp(search.trim(), "i");
    filter.$or = [{ email: rx }, { firstName: rx }, { lastName: rx }];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .select("email firstName lastName role isActive createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    items: items.map((u) => ({
      id: u._id.toString(),
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
    })),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function updateUserRole(actor, userId, newRole) {
  if (actor.sub === userId) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "You cannot change your own role here");
  }

  if (![ROLES.ADMIN, ROLES.EMPLOYEE].includes(newRole)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid role");
  }

  const target = await User.findById(userId);
  if (!target) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");

  if (target.role === ROLES.ADMIN && newRole !== ROLES.ADMIN) {
    const adminCount = await User.countDocuments({ role: ROLES.ADMIN, isActive: true });
    if (adminCount <= 1) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Cannot remove the last active admin");
    }
  }

  target.role = newRole;
  await target.save();

  return {
    id: target.id,
    email: target.email,
    firstName: target.firstName,
    lastName: target.lastName,
    role: target.role,
  };
}
