import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiFeedback } from "../components/ApiFeedback";
import { StatusCard } from "../components/StatusCard";
import { healthService } from "../services/healthService";
import type { ApiError } from "../types/api";

export function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<Record<string, string> | null>(null);

  async function fetchHealth() {
    setLoading(true);
    setError(null);

    try {
      const data = await healthService.check();
      setHealth(data);
    } catch (err) {
      setError((err as ApiError).message);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchHealth();
  }, []);

  const details = health
    ? Object.entries(health)
        .map(([key, value]) => `${key} ${value}`)
        .join(" | ")
    : undefined;

  return (
    <section className="page-grid page-enter">
      <header>
        <p className="eyebrow">Overview</p>
        <h2>Dashboard</h2>
      </header>

      <StatusCard
        title="API health"
        state={error ? "error" : loading ? "loading" : health ? "healthy" : "idle"}
        details={error ?? details}
      />

      <ApiFeedback loading={loading} error={error} />

      <div className="quick-links">
        <Link className="btn btn-outline" to="/users/create">
          Create User
        </Link>
        <Link className="btn btn-outline" to="/users">
          List Users
        </Link>
      </div>

      <button className="btn btn-secondary" type="button" onClick={() => void fetchHealth()}>
        Refresh Health
      </button>
    </section>
  );
}
