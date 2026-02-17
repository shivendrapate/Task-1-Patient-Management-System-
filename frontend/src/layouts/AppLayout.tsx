import { Outlet } from "react-router-dom";
import { NavShell } from "../components/NavShell";

export function AppLayout() {
  return (
    <div className="app-layout">
      <NavShell />
      <main className="content-shell">
        <Outlet />
      </main>
    </div>
  );
}
