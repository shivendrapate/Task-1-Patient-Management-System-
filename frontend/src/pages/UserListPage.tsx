import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiFeedback } from "../components/ApiFeedback";
import { DataTable } from "../components/DataTable";
import { useRoleGuard } from "../hooks/useRoleGuard";
import { userService } from "../services/userService";
import type { ApiError, UserResponse, UserRole } from "../types/api";

const roles: UserRole[] = ["patient", "doctor", "admin", "super_admin"];

export function UserListPage() {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [role, setRole] = useState<string>("");
  const [activeState, setActiveState] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<UserResponse[]>([]);

  const access = useRoleGuard(["admin", "super_admin"]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await userService.list({
        limit,
        offset,
        role: role ? (role as UserRole) : undefined,
        is_active:
          activeState === ""
            ? undefined
            : activeState === "true"
              ? true
              : false,
      });
      setRows(data);
    } catch (err) {
      setRows([]);
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  }, [activeState, limit, offset, role]);

  useEffect(() => {
    if (access.allowed) {
      void loadUsers();
    }
  }, [access.allowed, loadUsers]);

  if (!access.allowed) {
    return (
      <section className="panel page-enter">
        <header>
          <p className="eyebrow">Users API</p>
          <h2>List users</h2>
        </header>
        <ApiFeedback error={access.reason} />
      </section>
    );
  }

  return (
    <section className="page-grid page-enter">
      <header>
        <p className="eyebrow">Users API</p>
        <h2>List users</h2>
      </header>

      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault();
          void loadUsers();
        }}
      >
        <label>
          Limit
          <input
            type="number"
            min={1}
            max={100}
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
          />
        </label>

        <label>
          Offset
          <input
            type="number"
            min={0}
            value={offset}
            onChange={(event) => setOffset(Number(event.target.value))}
          />
        </label>

        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="">All</option>
            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Active
          <select
            value={activeState}
            onChange={(event) => setActiveState(event.target.value)}
          >
            <option value="">All</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </label>

        <button className="btn" type="submit" disabled={loading}>
          Apply Filters
        </button>
      </form>

      <ApiFeedback loading={loading} error={error} />

      <DataTable
        caption="Users"
        rows={rows}
        rowKey={(row) => row.id}
        columns={[
          { key: "id", label: "ID" },
          { key: "username", label: "Username" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          {
            key: "is_active",
            label: "Active",
            render: (row) => (row.is_active ? "Yes" : "No"),
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="table-actions">
                <Link to={`/users/${row.id}`}>Detail</Link>
                <Link to={`/users/${row.id}/update`}>PUT</Link>
                <Link to={`/users/${row.id}/patch`}>PATCH</Link>
                <Link to={`/users/${row.id}/actions`}>Delete/Restore</Link>
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
