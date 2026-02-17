import { jwtDecode } from "jwt-decode";
import type { AuthTokenPayload } from "../types/api";

const TOKEN_KEY = "pms_access_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function decodeToken(token: string): AuthTokenPayload | null {
  try {
    return jwtDecode<AuthTokenPayload>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(payload: AuthTokenPayload | null): boolean {
  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
}

export function getStoredTokenPayload(): AuthTokenPayload | null {
  const token = getToken();
  if (!token) {
    return null;
  }

  return decodeToken(token);
}

export { TOKEN_KEY };
