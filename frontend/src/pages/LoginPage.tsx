import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ApiFeedback } from "../components/ApiFeedback";
import { useAuth } from "../hooks/useAuth";
import { decodeToken } from "../lib/token";
import { authService } from "../services/authService";
import type { ApiError, UserRole } from "../types/api";

type LoginMode = "doctor" | "patient" | "admin";
const loginModes: LoginMode[] = ["doctor", "patient", "admin"];

const allowedRolesByMode: Record<LoginMode, UserRole[]> = {
  doctor: ["doctor"],
  patient: ["patient"],
  admin: ["admin", "super_admin"],
};

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInput = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loginMode, setLoginMode] = useState<LoginMode>("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(values: LoginFormInput) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authService.login(values);
      const payload = decodeToken(response.access_token);
      const allowedRoles = allowedRolesByMode[loginMode];

      if (!payload?.role || !allowedRoles.includes(payload.role)) {
        const suggestedMode =
          payload?.role === "super_admin"
            ? "admin"
            : payload?.role ?? "the correct role";
        setError(
          `Role mismatch. Use login mode: ${suggestedMode}.`,
        );
        return;
      }

      login(response.access_token, response.refresh_token);
      setSuccess("Login successful. Redirecting...");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel page-enter">
      <header>
        <p className="eyebrow">Auth</p>
        <h2>Sign in</h2>
      </header>

      <div className="role-mode-grid" aria-label="Login mode">
        {loginModes.map((mode) => (
          <button
            key={mode}
            type="button"
            className={mode === loginMode ? "role-mode-btn role-mode-btn-active" : "role-mode-btn"}
            onClick={() => setLoginMode(mode)}
          >
            {mode === "admin" ? "Login as Admin" : `Login as ${mode[0].toUpperCase()}${mode.slice(1)}`}
          </button>
        ))}
      </div>

      <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Username
          <input type="text" {...register("username")} autoComplete="username" />
          {errors.username ? <span className="field-error">{errors.username.message}</span> : null}
        </label>

        <label>
          Password
          <input type="password" {...register("password")} autoComplete="current-password" />
          {errors.password ? <span className="field-error">{errors.password.message}</span> : null}
        </label>

        <button type="submit" className="btn" disabled={loading}>
          Login
        </button>
      </form>

      <ApiFeedback loading={loading} error={error} success={success} />
    </section>
  );
}
