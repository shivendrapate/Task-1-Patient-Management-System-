import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthTokenPayload, UserRole } from "../types/api";
import {
  clearToken,
  decodeToken,
  getRefreshToken,
  getToken,
  isTokenExpired,
  setTokens,
} from "../lib/token";

export interface AuthContextValue {
  token: string | null;
  payload: AuthTokenPayload | null;
  role: UserRole | null;
  userId: number | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function parseUserId(payload: AuthTokenPayload | null): number | null {
  if (!payload?.sub) {
    return null;
  }

  const num = Number(payload.sub);
  return Number.isFinite(num) ? num : null;
}

function getValidatedTokenState(): {
  token: string | null;
  payload: AuthTokenPayload | null;
} {
  const accessToken = getToken();
  const refreshToken = getRefreshToken();

  if (!accessToken) {
    return { token: null, payload: null };
  }

  const payload = decodeToken(accessToken);
  if (!payload || isTokenExpired(payload)) {
    if (!refreshToken) {
      clearToken();
      return { token: null, payload: null };
    }
  }

  return { token: accessToken, payload };
}

function hasValidSession(token: string | null, payload: AuthTokenPayload | null): boolean {
  if (!token || !payload) {
    return false;
  }

  if (!isTokenExpired(payload)) {
    return true;
  }

  return Boolean(getRefreshToken());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(getValidatedTokenState);

  const login = useCallback((accessToken: string, refreshToken: string) => {
    const payload = decodeToken(accessToken);

    if (!payload || isTokenExpired(payload)) {
      clearToken();
      setState({ token: null, payload: null });
      return;
    }

    setTokens(accessToken, refreshToken);
    setState({ token: accessToken, payload });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setState({ token: null, payload: null });
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      logout();
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: state.token,
      payload: state.payload,
      role: state.payload?.role ?? null,
      userId: parseUserId(state.payload),
      isAuthenticated: hasValidSession(state.token, state.payload),
      login,
      logout,
    }),
    [login, logout, state.payload, state.token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
