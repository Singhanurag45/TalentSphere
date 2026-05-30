export type EmployeeStatus = "active" | "on-leave" | "inactive";
export type EmployeeType = "full-time" | "part-time" | "contract" | "intern";

export type Employee = {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  employmentType: EmployeeType;
  status: EmployeeStatus;
  dateOfJoining: string;
  managerName: string;
  location: string;
  salary: number | null;
  avatarUrl: string;
  bio: string;
  skills: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeePayload = {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  department: string;
  designation: string;
  employmentType: EmployeeType;
  status: EmployeeStatus;
  dateOfJoining: string;
  managerName?: string;
  location?: string;
  salary?: number | null;
  avatarUrl?: string;
  bio?: string;
  skills?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
};

export type EmployeeListFilters = {
  page: number;
  limit: number;
  search: string;
  department: string;
  status: "" | EmployeeStatus;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};
