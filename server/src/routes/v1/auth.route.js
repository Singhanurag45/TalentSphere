import { Router } from "express";

import {
  loginController,
  logoutController,
  meController,
  refreshController,
} from "../../controllers/auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema, logoutSchema, refreshSchema } from "../../schemas/auth.schema.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/login", validate(loginSchema), loginController);
authRouter.post("/refresh-token", validate(refreshSchema), refreshController);
authRouter.post("/logout", validate(logoutSchema), logoutController);
authRouter.get("/me", requireAuth, meController);
