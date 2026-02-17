interface StatusCardProps {
  title: string;
  state: "idle" | "loading" | "healthy" | "error";
  details?: string;
}

export function StatusCard({ title, state, details }: StatusCardProps) {
  return (
    <article className={`status-card status-card-${state}`}>
      <h2>{title}</h2>
      <p className="status-card-state">{state.toUpperCase()}</p>
      {details ? <p className="status-card-details">{details}</p> : null}
    </article>
  );
}
