import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";

/** Reports module shell — extend with report handlers. */
export const reportsRouter = Router();

reportsRouter.use(requireAuth, authorizeRoles([ROLES.ADMIN]));
