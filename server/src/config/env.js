import dotenv from "dotenv";

dotenv.config();

function getEnv(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = Object.freeze({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: Number(getEnv("PORT", "3000")),
  API_PREFIX: getEnv("API_PREFIX", "/api"),
  API_VERSION: getEnv("API_VERSION", "v1"),
  CLIENT_ORIGIN: getEnv("CLIENT_ORIGIN", "http://localhost:5173"),
  MONGODB_URI: getEnv("MONGODB_URI"),
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: getEnv("JWT_ACCESS_EXPIRES_IN", "15m"),
  JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d"),
  REFRESH_COOKIE_NAME: getEnv("REFRESH_COOKIE_NAME", "hrms_refresh_token"),
  COOKIE_SECURE: getEnv("COOKIE_SECURE", "false") === "true",
  SEED_ADMIN_EMAIL: getEnv("SEED_ADMIN_EMAIL", "admin@newhrms.com"),
  SEED_ADMIN_PASSWORD: getEnv("SEED_ADMIN_PASSWORD", "Admin@12345"),
});
