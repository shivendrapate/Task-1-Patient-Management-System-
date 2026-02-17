import { useState } from "react";
import { ApiFeedback } from "../components/ApiFeedback";
import { DataTable } from "../components/DataTable";
import { useRoleGuard } from "../hooks/useRoleGuard";
import { assignmentService } from "../services/assignmentService";
import type { ApiError, DoctorProfile } from "../types/api";

export function PatientDoctorsPage() {
  const access = useRoleGuard(["admin", "super_admin", "patient"]);
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<DoctorProfile[]>([]);

  async function runLookup() {
    const id = Number(patientId);

    if (!Number.isFinite(id) || id <= 0) {
      setError("Provide a valid patient id");
      setRows([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await assignmentService.getPatientDoctors(id);
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
          <h2>Assigned doctors</h2>
        </header>
        <ApiFeedback error={access.reason} />
      </section>
    );
  }

  return (
    <section className="page-grid page-enter">
      <header>
        <p className="eyebrow">Assignments API</p>
        <h2>Assigned doctors</h2>
      </header>

      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault();
          void runLookup();
        }}
      >
        <label>
          Patient ID
          <input
            type="number"
            min={1}
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
          />
        </label>
        <button className="btn" type="submit" disabled={loading}>
          Fetch Doctors
        </button>
      </form>

      <ApiFeedback loading={loading} error={error} success={rows.length ? "Lookup complete" : null} />

      <DataTable
        caption="Doctors linked to patient"
        rows={rows}
        rowKey={(row) => row.id}
        columns={[
          { key: "id", label: "Doctor ID" },
          { key: "user_id", label: "User ID" },
          { key: "specialization", label: "Specialization" },
        ]}
      />
    </section>
  );
}
