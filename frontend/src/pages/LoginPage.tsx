import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ApiFeedback } from "../components/ApiFeedback";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import type { ApiError } from "../types/api";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInput = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
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
      login(response.access_token);
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
