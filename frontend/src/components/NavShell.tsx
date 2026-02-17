import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function navClassName({ isActive }: { isActive: boolean }) {
  return isActive ? "nav-link nav-link-active" : "nav-link";
}

export function NavShell() {
  const { role, logout, userId } = useAuth();
  const isAdmin = role === "admin" || role === "super_admin";
  const isDoctor = role === "doctor";
  const isPatient = role === "patient";

  return (
    <aside className="nav-shell">
      <div className="brand-block">
        <p className="brand-eyebrow">Patient Management</p>
        <h1>Frontend Console</h1>
        <p className="brand-role">Role: {role ?? "guest"}</p>
      </div>

      <nav className="nav-grid">
        <NavLink to="/dashboard" className={navClassName}>
          Dashboard
        </NavLink>
        <NavLink to="/users/create" className={navClassName}>
          Create User
        </NavLink>
        {role === "admin" || role === "super_admin" ? (
          <>
            <NavLink to="/users" className={navClassName}>
              List Users
            </NavLink>
            <NavLink to="/assignments/new" className={navClassName}>
              Assign Patient
            </NavLink>
            <NavLink to="/assignments/doctor" className={navClassName}>
              Assigned Patients
            </NavLink>
            <NavLink to="/assignments/patient" className={navClassName}>
              Assigned Doctors
            </NavLink>
          </>
        ) : null}
        {userId ? (
          <NavLink to={`/users/${userId}`} className={navClassName}>
            My User Detail
          </NavLink>
        ) : null}
        {!isAdmin && isDoctor ? (
          <NavLink to="/assignments/doctor" className={navClassName}>
            Assigned Patients
          </NavLink>
        ) : null}
        {!isAdmin && isPatient ? (
          <NavLink to="/assignments/patient" className={navClassName}>
            Assigned Doctors
          </NavLink>
        ) : null}
      </nav>

      <button type="button" className="btn btn-outline" onClick={logout}>
        Logout
      </button>
    </aside>
  );
}
