import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";

import { env } from "../config/env.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

export const securityMiddleware = [
  helmet(),
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
  express.json({ limit: "1mb" }),
  express.urlencoded({ extended: true, limit: "1mb" }),
  cookieParser(),
  compression(),
  limiter,
];
