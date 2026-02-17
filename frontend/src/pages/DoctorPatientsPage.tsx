import { useState } from "react";
import { ApiFeedback } from "../components/ApiFeedback";
import { DataTable } from "../components/DataTable";
import { useRoleGuard } from "../hooks/useRoleGuard";
import { assignmentService } from "../services/assignmentService";
import type { ApiError, PatientProfile } from "../types/api";

export function DoctorPatientsPage() {
  const access = useRoleGuard(["admin", "super_admin", "doctor"]);
  const [doctorId, setDoctorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<PatientProfile[]>([]);

  async function runLookup() {
    const id = Number(doctorId);

    if (!Number.isFinite(id) || id <= 0) {
      setError("Provide a valid doctor id");
      setRows([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await assignmentService.getDoctorPatients(id);
      setRows(response);
    } catch (err) {
      setRows([]);
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
          <h2>Doctor patients</h2>
        </header>
        <ApiFeedback error={access.reason} />
      </section>
    );
  }

  return (
    <section className="page-grid page-enter">
      <header>
        <p className="eyebrow">Assignments API</p>
        <h2>Assigned patients</h2>
      </header>

      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault();
          void runLookup();
        }}
      >
        <label>
          Doctor ID
          <input
            type="number"
            min={1}
            value={doctorId}
            onChange={(event) => setDoctorId(event.target.value)}
          />
        </label>
        <button className="btn" type="submit" disabled={loading}>
          Fetch Patients
        </button>
      </form>

      <ApiFeedback loading={loading} error={error} success={rows.length ? "Lookup complete" : null} />

      <DataTable
        caption="Patients linked to doctor"
        rows={rows}
        rowKey={(row) => row.id}
        columns={[
          { key: "id", label: "Patient ID" },
          { key: "user_id", label: "User ID" },
          { key: "height", label: "Height" },
          { key: "weight", label: "Weight" },
          { key: "bmi", label: "BMI" },
          { key: "disease", label: "Disease" },
        ]}
      />
    </section>
  );
}
