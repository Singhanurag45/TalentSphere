import type { AppRole } from "../config/roles";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AppRole;
  avatarUrl?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};
