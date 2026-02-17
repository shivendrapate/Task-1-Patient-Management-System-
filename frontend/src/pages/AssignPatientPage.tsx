import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiFeedback } from "../components/ApiFeedback";
import { useRoleGuard } from "../hooks/useRoleGuard";
import { assignmentService } from "../services/assignmentService";
import type { ApiError } from "../types/api";

const assignmentSchema = z.object({
  doctor_id: z.number().int().positive(),
  patient_id: z.number().int().positive(),
});

type AssignmentInput = z.infer<typeof assignmentSchema>;

export function AssignPatientPage() {
  const access = useRoleGuard(["admin", "super_admin"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignmentInput>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      doctor_id: 1,
      patient_id: 1,
    },
  });

  async function onSubmit(values: AssignmentInput) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await assignmentService.assign(values);
      setSuccess(response.message);
      reset({ doctor_id: 1, patient_id: 1 });
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }

  if (!access.allowed) {
    return (
      <section className="panel page-enter">
        <header>
          <p className="eyebrow">Assignments API</p>
          <h2>Assign patient to doctor</h2>
        </header>
        <ApiFeedback error={access.reason} />
      </section>
    );
  }

  return (
    <section className="panel page-enter">
      <header>
        <p className="eyebrow">Assignments API</p>
        <h2>Assign patient to doctor</h2>
      </header>

      <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Doctor ID
          <input
            type="number"
            min={1}
            {...register("doctor_id", { valueAsNumber: true })}
          />
          {errors.doctor_id ? (
            <span className="field-error">{errors.doctor_id.message}</span>
          ) : null}
        </label>

        <label>
          Patient ID
          <input
            type="number"
            min={1}
            {...register("patient_id", { valueAsNumber: true })}
          />
          {errors.patient_id ? (
            <span className="field-error">{errors.patient_id.message}</span>
          ) : null}
        </label>

        <button className="btn" type="submit" disabled={loading}>
          Assign
        </button>
      </form>

      <ApiFeedback loading={loading} error={error} success={success} />
    </section>
  );
}
