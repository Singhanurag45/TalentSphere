import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/roles.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createEmployeeController,
  deleteEmployeeController,
  employeeDepartmentsController,
  getEmployeeController,
  listEmployeesController,
  updateEmployeeController,
} from "../../controllers/employee.controller.js";
import {
  createEmployeeSchema,
  employeeIdSchema,
  listEmployeesSchema,
  updateEmployeeSchema,
} from "../../schemas/employee.schema.js";

export const employeeRouter = Router();

employeeRouter.use(requireAuth, authorizeRoles([ROLES.ADMIN]));

employeeRouter.get("/", validate(listEmployeesSchema), listEmployeesController);
employeeRouter.get("/departments", employeeDepartmentsController);
employeeRouter.get(
  "/:employeeId",
  validate(employeeIdSchema),
  getEmployeeController,
);
employeeRouter.post(
  "/",
  validate(createEmployeeSchema),
  createEmployeeController,
);
employeeRouter.patch(
  "/:employeeId",
  validate(updateEmployeeSchema),
  updateEmployeeController,
);
employeeRouter.delete(
  "/:employeeId",
  validate(employeeIdSchema),
  deleteEmployeeController,
);
