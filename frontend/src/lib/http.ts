import axios from "axios";
import type { LoginResponse } from "../types/api";
import { clearToken, getRefreshToken, getToken, setTokens } from "./token";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await refreshClient.post<LoginResponse>("/auth/refresh", {
      refresh_token: refreshToken,
    });

    setTokens(response.data.access_token, response.data.refresh_token);
    return response.data.access_token;
  } catch {
    return null;
  }
}

function isAuthEndpoint(url?: string): boolean {
  return Boolean(url && (url.includes("/auth/login") || url.includes("/auth/refresh")));
}

http.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config as
      | ({ _retry?: boolean; url?: string; headers?: Record<string, string> } & typeof error.config)
      | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint(originalRequest.url)) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;
      if (newAccessToken) {
        originalRequest.headers = {
          ...(originalRequest.headers ?? {}),
          Authorization: `Bearer ${newAccessToken}`,
        };
        return http(originalRequest);
      }
    }

    if (status === 401) {
      clearToken();
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  },
);
