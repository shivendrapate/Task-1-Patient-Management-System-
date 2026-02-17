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
  getToken,
  isTokenExpired,
  setToken,
} from "../lib/token";

export interface AuthContextValue {
  token: string | null;
  payload: AuthTokenPayload | null;
  role: UserRole | null;
  userId: number | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
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
  const stored = getToken();

  if (!stored) {
    return { token: null, payload: null };
  }

  const payload = decodeToken(stored);
  if (!payload || isTokenExpired(payload)) {
    clearToken();
    return { token: null, payload: null };
  }

  return { token: stored, payload };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(getValidatedTokenState);

  const login = useCallback((token: string) => {
    const payload = decodeToken(token);

    if (!payload || isTokenExpired(payload)) {
      clearToken();
      setState({ token: null, payload: null });
      return;
    }

    setToken(token);
    setState({ token, payload });
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

  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((current) => {
        if (!current.payload) {
          return current;
        }

        if (!isTokenExpired(current.payload)) {
          return current;
        }

        clearToken();
        return { token: null, payload: null };
      });
    }, 15000);

    return () => window.clearInterval(interval);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: state.token,
      payload: state.payload,
      role: state.payload?.role ?? null,
      userId: parseUserId(state.payload),
      isAuthenticated: Boolean(state.token && state.payload),
      login,
      logout,
    }),
    [login, logout, state.payload, state.token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
