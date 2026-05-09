import { HTTP_STATUS } from "../constants/http-status.js";
import { ApiError } from "../utils/api-error.js";

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(
        new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, "Validation failed", result.error.flatten())
      );
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;
    return next();
  };
}
