import type { UserRole } from "../types/api";
import { useAuth } from "./useAuth";

export interface RoleGuardResult {
  allowed: boolean;
  reason: string | null;
}

export function useRoleGuard(allowedRoles: UserRole[]): RoleGuardResult {
  const { role } = useAuth();

  if (!role) {
    return {
      allowed: false,
      reason: "Sign in required.",
    };
  }

  if (!allowedRoles.includes(role)) {
    return {
      allowed: false,
      reason: "Access forbidden for your role.",
    };
  }

  return {
    allowed: true,
    reason: null,
  };
}
