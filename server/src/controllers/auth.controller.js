import { apiSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { loginWithPassword, revokeSession, rotateRefreshToken } from "../services/auth.service.js";
import { env } from "../config/env.js";
import { getRefreshCookieOptions } from "../services/cookie.service.js";

function extractRefreshToken(req) {
  return req.cookies?.[env.REFRESH_COOKIE_NAME] || req.body?.refreshToken || null;
}

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const authPayload = await loginWithPassword({
    email,
    password,
    userAgent: req.headers["user-agent"] || "",
    ipAddress: req.ip || "",
  });

  res.cookie(env.REFRESH_COOKIE_NAME, authPayload.refreshToken, getRefreshCookieOptions());

  return res.status(200).json(
    apiSuccess({
      message: "Login successful",
      data: {
        accessToken: authPayload.accessToken,
        user: authPayload.user,
      },
    })
  );
});

export const refreshController = asyncHandler(async (req, res) => {
  const token = extractRefreshToken(req);
  const authPayload = await rotateRefreshToken({
    rawRefreshToken: token,
    userAgent: req.headers["user-agent"] || "",
    ipAddress: req.ip || "",
  });

  res.cookie(env.REFRESH_COOKIE_NAME, authPayload.refreshToken, getRefreshCookieOptions());

  return res.status(200).json(
    apiSuccess({
      message: "Access token refreshed",
      data: {
        accessToken: authPayload.accessToken,
        user: authPayload.user,
      },
    })
  );
});

export const logoutController = asyncHandler(async (req, res) => {
  const token = extractRefreshToken(req);
  await revokeSession(token);
  res.clearCookie(env.REFRESH_COOKIE_NAME, getRefreshCookieOptions());

  return res.status(200).json(
    apiSuccess({
      message: "Logged out successfully",
    })
  );
});

export function meController(req, res) {
  return res.status(200).json(
    apiSuccess({
      message: "Authenticated user profile",
      data: req.auth,
    })
  );
}
