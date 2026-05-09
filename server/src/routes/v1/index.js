import { Router } from "express";

import { healthRouter } from "./health.route.js";
import { authRouter } from "./auth.route.js";

export const v1Router = Router();

v1Router.use("/health", healthRouter);
v1Router.use("/auth", authRouter);
