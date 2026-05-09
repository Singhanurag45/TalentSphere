import { HTTP_STATUS } from "../constants/http-status.js";
import { logger } from "../config/logger.js";
import { apiError } from "../utils/api-response.js";

export function errorMiddleware(err, req, res, _next) {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isOperational = statusCode < 500;

  logger.error("Request failed", {
    requestId: req.id,
    path: req.originalUrl,
    method: req.method,
    statusCode,
    message: err.message,
  });

  return res.status(statusCode).json(
    apiError({
      message: err.message || "Internal server error",
      details: isOperational ? err.details : null,
    })
  );
}
