import type { ReactNode } from "react";

interface ApiFeedbackProps {
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  children?: ReactNode;
}

export function ApiFeedback({
  loading = false,
  error,
  success,
  children,
}: ApiFeedbackProps) {
  return (
    <div className="api-feedback-stack" aria-live="polite">
      {loading ? <p className="status status-loading">Loading...</p> : null}
      {error ? <p className="status status-error">{error}</p> : null}
      {success ? <p className="status status-success">{success}</p> : null}
      {children}
    </div>
  );
}
