import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="auth-layout">
      <section className="panel page-enter">
        <p className="eyebrow">404</p>
        <h2>Page not found</h2>
        <p className="muted-text">The route does not exist.</p>
        <div className="action-row">
          <Link className="btn" to="/dashboard">
            Dashboard
          </Link>
          <Link className="btn btn-outline" to="/login">
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
