import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { ApiFeedback } from "../components/ApiFeedback";
import { userService } from "../services/userService";
import type { ApiError } from "../types/api";

const updateSchema = z.object({
  username: z.string().min(1, "Username is required"),
  is_active: z.enum(["true", "false"]),
});

type UserUpdateInput = z.infer<typeof updateSchema>;

export function UserUpdatePage() {
  const params = useParams();
  const userId = useMemo(() => Number(params.id), [params.id]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserUpdateInput>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      username: "",
      is_active: "true",
    },
  });

  useEffect(() => {
    if (!Number.isFinite(userId)) {
      return;
    }

    const loadInitial = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = await userService.getById(userId);
        reset({
          username: user.username,
          is_active: user.is_active ? "true" : "false",
        });
      } catch (err) {
        setError((err as ApiError).message);
      } finally {
        setLoading(false);
      }
    };

    void loadInitial();
  }, [reset, userId]);

  async function onSubmit(values: UserUpdateInput) {
    if (!Number.isFinite(userId)) {
      setError("Invalid user id");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await userService.put(userId, {
        username: values.username,
        is_active: values.is_active === "true",
      });
      setSuccess(`Updated user #${updated.id}`);
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
        <h2>PUT update user</h2>
      </header>

      <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Username
          <input type="text" {...register("username")} />
          {errors.username ? <span className="field-error">{errors.username.message}</span> : null}
        </label>

        <label>
          Is Active
          <select {...register("is_active")}>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          {errors.is_active ? <span className="field-error">{errors.is_active.message}</span> : null}
        </label>

        <button className="btn" type="submit" disabled={loading}>
          Submit PUT
        </button>
      </form>

      <ApiFeedback loading={loading} error={error} success={success} />
    </section>
  );
}
