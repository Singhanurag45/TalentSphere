import { env } from "../config/env.js";

export function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: `${env.API_PREFIX}/${env.API_VERSION}/auth`,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}
