import { apiSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  listEmployeeDepartments,
  listEmployees,
  updateEmployee,
} from "../services/employee.service.js";

export const listEmployeesController = asyncHandler(async (req, res) => {
  const { page, limit, search, department, status } = req.query;
  const result = await listEmployees({
    page,
    limit,
    search,
    department,
    status,
  });

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Employees fetched successfully",
      data: result.items,
      meta: result.pagination,
    }),
  );
});

export const getEmployeeController = asyncHandler(async (req, res) => {
  const employee = await getEmployeeById(req.params.employeeId);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Employee fetched successfully",
      data: employee,
    }),
  );
});

export const createEmployeeController = asyncHandler(async (req, res) => {
  const employee = await createEmployee(req.body);

  return res.status(HTTP_STATUS.CREATED).json(
    apiSuccess({
      message: "Employee created successfully",
      data: employee,
    }),
  );
});

export const updateEmployeeController = asyncHandler(async (req, res) => {
  const employee = await updateEmployee(req.params.employeeId, req.body);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Employee updated successfully",
      data: employee,
    }),
  );
});

export const deleteEmployeeController = asyncHandler(async (req, res) => {
  await deleteEmployee(req.params.employeeId);

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Employee deleted successfully",
    }),
  );
});

export const employeeDepartmentsController = asyncHandler(async (_req, res) => {
  const departments = await listEmployeeDepartments();

  return res.status(HTTP_STATUS.OK).json(
    apiSuccess({
      message: "Departments fetched successfully",
      data: departments,
    }),
  );
});
