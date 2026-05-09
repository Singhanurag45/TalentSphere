export function apiSuccess({ message, data = null, meta = null }) {
  return {
    success: true,
    message,
    data,
    meta,
    error: null,
  };
}

export function apiError({ message, details = null }) {
  return {
    success: false,
    message,
    data: null,
    meta: null,
    error: details,
  };
}
