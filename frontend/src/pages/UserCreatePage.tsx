import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ApiFeedback } from "../components/ApiFeedback";
import { userService } from "../services/userService";
import type { ApiError, UserResponse, UserRole } from "../types/api";

const roles: UserRole[] = ["patient", "doctor", "admin", "super_admin"];

const createSchema = z.object({
  username: z.string().min(3, "Minimum 3 characters"),
  email: z.string().email("Valid email required"),
  role: z.enum(roles),
  password: z.string().min(4, "Minimum 4 characters"),
});

type UserCreateInput = z.infer<typeof createSchema>;

export function UserCreatePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<UserResponse | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserCreateInput>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "patient",
      password: "",
    },
  });

  async function onSubmit(values: UserCreateInput) {
    setLoading(true);
    setError(null);
    setCreatedUser(null);

    try {
      const user = await userService.create(values);
      setCreatedUser(user);
      reset({ username: "", email: "", role: values.role, password: "" });
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel page-enter">
      <header>
        <p className="eyebrow">Users API</p>
        <h2>Create user</h2>
      </header>

      <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Username
          <input type="text" {...register("username")} />
          {errors.username ? <span className="field-error">{errors.username.message}</span> : null}
        </label>

        <label>
          Email
          <input type="email" {...register("email")} />
          {errors.email ? <span className="field-error">{errors.email.message}</span> : null}
        </label>

        <label>
          Role
          <select {...register("role")}>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role ? <span className="field-error">{errors.role.message}</span> : null}
        </label>

        <label>
          Password
          <input type="password" {...register("password")} />
          {errors.password ? <span className="field-error">{errors.password.message}</span> : null}
        </label>

        <button className="btn" type="submit" disabled={loading}>
          Create User
        </button>
      </form>

      <ApiFeedback
        loading={loading}
        error={error}
        success={createdUser ? `Created user #${createdUser.id}` : null}
      >
        {createdUser ? (
          <div className="result-card">
            <p>
              <strong>ID:</strong> {createdUser.id}
            </p>
            <p>
              <strong>Username:</strong> {createdUser.username}
            </p>
            <p>
              <strong>Role:</strong> {createdUser.role}
            </p>
            <Link className="inline-link" to="/login">
              Continue to login
            </Link>
          </div>
        ) : null}
      </ApiFeedback>
    </section>
  );
}
