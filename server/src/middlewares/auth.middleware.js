import { HTTP_STATUS } from "../constants/http-status.js";
import { ApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../services/token.service.js";
import { User } from "../models/user.model.js";

export async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Access token missing"));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).lean();
    if (!user || !user.isActive) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "User account is inactive"));
    }
    req.auth = {
      sub: user._id.toString(),
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl || "",
    };
    return next();
  } catch {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired access token"));
  }
}
