import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiFeedback } from "../components/ApiFeedback";
import { userService } from "../services/userService";
import type { ApiError, UserResponse } from "../types/api";

export function UserDetailPage() {
  const params = useParams();
  const userId = useMemo(() => Number(params.id), [params.id]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);

  const fetchUser = useCallback(async () => {
    if (!Number.isFinite(userId)) {
      setError("Invalid user id");
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await userService.getById(userId);
      setUser(data);
    } catch (err) {
      setUser(null);
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return (
    <section className="panel page-enter">
      <header>
        <p className="eyebrow">Users API</p>
        <h2>User detail</h2>
      </header>

      <p className="muted-text">Endpoint: GET /users/{"{user_id}"}</p>
      <ApiFeedback loading={loading} error={error} success={user ? `Fetched #${user.id}` : null}>
        {user ? (
          <dl className="definition-grid">
            <dt>ID</dt>
            <dd>{user.id}</dd>
            <dt>Username</dt>
            <dd>{user.username}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Role</dt>
            <dd>{user.role}</dd>
            <dt>Active</dt>
            <dd>{user.is_active ? "Yes" : "No"}</dd>
            <dt>Created</dt>
            <dd>{new Date(user.created_at).toLocaleString()}</dd>
          </dl>
        ) : null}
      </ApiFeedback>

      <div className="action-row">
        <button className="btn" type="button" onClick={() => void fetchUser()}>
          Refresh
        </button>
        {Number.isFinite(userId) ? (
          <>
            <Link className="btn btn-outline" to={`/users/${userId}/update`}>
              Open PUT
            </Link>
            <Link className="btn btn-outline" to={`/users/${userId}/patch`}>
              Open PATCH
            </Link>
            <Link className="btn btn-outline" to={`/users/${userId}/actions`}>
              Open Actions
            </Link>
          </>
        ) : null}
      </div>
    </section>
  );
}
