import bcrypt from "bcryptjs";

import { ROLES } from "../constants/roles.js";
import { User } from "../models/user.model.js";
import { RefreshToken } from "../models/refresh-token.model.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./token.service.js";
import { hashToken } from "../utils/crypto.js";
import { ApiError } from "../utils/api-error.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { env } from "../config/env.js";

function getRefreshExpiryDate() {
  const now = Date.now();
  return new Date(now + 7 * 24 * 60 * 60 * 1000);
}

function buildAuthUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export async function ensureAdminSeedUser() {
  const existingAdmin = await User.findOne({ email: env.SEED_ADMIN_EMAIL }).lean();
  if (existingAdmin) return;

  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12);
  await User.create({
    firstName: "System",
    lastName: "Admin",
    email: env.SEED_ADMIN_EMAIL,
    passwordHash,
    role: ROLES.ADMIN,
    isActive: true,
  });
}

export async function loginWithPassword({ email, password, userAgent = "", ipAddress = "" }) {
  const user = await User.findOne({ email }).exec();
  if (!user || !user.isActive) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");
  }

  const authUser = buildAuthUser(user);
  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshExpiryDate(),
    userAgent,
    ipAddress,
  });

  return { user: authUser, accessToken, refreshToken };
}

export async function rotateRefreshToken({ rawRefreshToken, userAgent = "", ipAddress = "" }) {
  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  const oldTokenHash = hashToken(rawRefreshToken);
  const session = await RefreshToken.findOne({ tokenHash: oldTokenHash }).exec();
  if (!session) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token session is invalid");
  }

  if (session.revokedAt) {
    const timeSinceRevoked = Date.now() - session.revokedAt.getTime();
    if (timeSinceRevoked > 15000) {
      // It was revoked more than 15 seconds ago. Token is invalid.
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token session is invalid");
    }
  } else {
    session.revokedAt = new Date();
    await session.save();
  }

  const user = await User.findById(payload.sub).exec();
  if (!user || !user.isActive) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User is not active");
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshExpiryDate(),
    userAgent,
    ipAddress,
  });

  return { accessToken, refreshToken, user: buildAuthUser(user) };
}

export async function revokeSession(rawRefreshToken) {
  if (!rawRefreshToken) return;
  const tokenHash = hashToken(rawRefreshToken);
  await RefreshToken.findOneAndUpdate(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  ).exec();
}
