import { HTTP_STATUS } from "../constants/http-status.js";
import { ApiError } from "../utils/api-error.js";

export function authorizeRoles(allowedRoles) {
  return (req, _res, next) => {
    const role = req.auth?.role;
    if (!role || !allowedRoles.includes(role)) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "You are not allowed to access this resource"));
    }
    return next();
  };
}
