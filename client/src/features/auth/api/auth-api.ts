import { http, tokenStorage } from "@/shared/api/http";
import type { AuthUser, LoginInput } from "@/shared/types/auth";

type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
};

export async function loginApi(payload: LoginInput) {
  const { data } = await http.post<AuthResponse>("/auth/login", payload);
  tokenStorage.setAccessToken(data.data.accessToken);
  return data.data.user;
}

export async function refreshApi() {
  const { data } = await http.post<AuthResponse>("/auth/refresh-token", {});
  tokenStorage.setAccessToken(data.data.accessToken);
  return data.data.user;
}

export async function meApi() {
  const { data } = await http.get<{ data: AuthUser }>("/auth/me");
  return data.data;
}

export async function logoutApi() {
  try {
    await http.post("/auth/logout", {});
  } finally {
    tokenStorage.clearAccessToken();
  }
}
