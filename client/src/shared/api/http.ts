import axios from "axios";

import { ENV } from "../config/env";

const ACCESS_TOKEN_KEY = "hrms_access_token";

export const tokenStorage = {
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
