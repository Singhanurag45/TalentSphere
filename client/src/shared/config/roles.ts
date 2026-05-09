export const ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];
