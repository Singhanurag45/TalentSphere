import { apiSuccess } from "../utils/api-response.js";

export function healthController(_req, res) {
  res.status(200).json(
    apiSuccess({
      message: "Service healthy",
      data: {
        service: "newhrms-server",
        timestamp: new Date().toISOString(),
      },
    })
  );
}
