import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiFeedback } from "../components/ApiFeedback";
import { useRoleGuard } from "../hooks/useRoleGuard";
import { userService } from "../services/userService";
import type { ApiError } from "../types/api";

type ActionName = "hard-delete" | "soft-delete" | "restore";

export function UserActionsPage() {
  const params = useParams();
  const userId = useMemo(() => Number(params.id), [params.id]);

  const access = useRoleGuard(["admin", "super_admin"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function runAction(action: ActionName) {
    if (!Number.isFinite(userId)) {
      setError("Invalid user id");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (action === "hard-delete") {
        const response = await userService.delete(userId);
        setSuccess(response.Message);
      }

      if (action === "soft-delete") {
        const response = await userService.softDelete(userId);
        setSuccess(response.Message);
      }

      if (action === "restore") {
        const response = await userService.restore(userId);
        setSuccess(response.Message);
      }
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
          <p className="eyebrow">Users API</p>
          <h2>Delete / Restore user</h2>
        </header>
        <ApiFeedback error={access.reason} />
      </section>
    );
  }

  return (
    <section className="panel page-enter">
      <header>
        <p className="eyebrow">Users API</p>
        <h2>Delete / Restore user</h2>
      </header>

      <p className="muted-text">User ID: {Number.isFinite(userId) ? userId : "invalid"}</p>

      <div className="action-row">
        <button
          className="btn btn-danger"
          type="button"
          disabled={loading}
          onClick={() => void runAction("hard-delete")}
        >
          DELETE /users/{"{id}"}
        </button>
        <button
          className="btn btn-warn"
          type="button"
          disabled={loading}
          onClick={() => void runAction("soft-delete")}
        >
          DELETE /users/{"{id}"}/soft_delete_user
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          disabled={loading}
          onClick={() => void runAction("restore")}
        >
          POST /users/{"{id}"}/restore
        </button>
      </div>

      <ApiFeedback loading={loading} error={error} success={success} />
    </section>
  );
}
