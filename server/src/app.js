import express from "express";

import { env } from "./config/env.js";
import { requestIdMiddleware } from "./middlewares/request-id.middleware.js";
import { securityMiddleware } from "./middlewares/security.middleware.js";
import { requestLoggerMiddleware } from "./middlewares/request-logger.middleware.js";
import { apiRouter } from "./routes/index.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(requestIdMiddleware);
  app.use(securityMiddleware);
  app.use(requestLoggerMiddleware);

  app.use(`${env.API_PREFIX}/${env.API_VERSION}`, apiRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
