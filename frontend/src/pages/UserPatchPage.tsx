import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { ApiFeedback } from "../components/ApiFeedback";
import { userService } from "../services/userService";
import type { ApiError, UserUpdate } from "../types/api";

const patchSchema = z.object({
  username: z.string().optional(),
  is_active: z.enum(["", "true", "false"]),
});

type UserPatchInput = z.infer<typeof patchSchema>;

export function UserPatchPage() {
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
  } = useForm<UserPatchInput>({
    resolver: zodResolver(patchSchema),
    defaultValues: {
      username: "",
      is_active: "",
    },
  });

  async function onSubmit(values: UserPatchInput) {
    if (!Number.isFinite(userId)) {
      setError("Invalid user id");
      return;
    }

    const payload: UserUpdate = {};

    if (values.username && values.username.trim()) {
      payload.username = values.username.trim();
    }

    if (values.is_active === "true") {
      payload.is_active = true;
    }

    if (values.is_active === "false") {
      payload.is_active = false;
    }

    if (Object.keys(payload).length === 0) {
      setError("Provide at least one field for PATCH.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await userService.patch(userId, payload);
      setSuccess(`Patched user #${updated.id}`);
      reset({ username: "", is_active: "" });
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
        <h2>PATCH user</h2>
      </header>

      <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Username (optional)
          <input type="text" {...register("username")} />
          {errors.username ? <span className="field-error">{errors.username.message}</span> : null}
        </label>

        <label>
          Is Active (optional)
          <select {...register("is_active")}>
            <option value="">No Change</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          {errors.is_active ? <span className="field-error">{errors.is_active.message}</span> : null}
        </label>

        <button className="btn" type="submit" disabled={loading}>
          Submit PATCH
        </button>
      </form>

      <ApiFeedback loading={loading} error={error} success={success} />
    </section>
  );
}
