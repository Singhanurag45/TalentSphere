import { HTTP_STATUS } from "../constants/http-status.js";
import { ApiError } from "../utils/api-error.js";

export function notFoundMiddleware(req, _res, next) {
  next(new ApiError(HTTP_STATUS.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`));
}
