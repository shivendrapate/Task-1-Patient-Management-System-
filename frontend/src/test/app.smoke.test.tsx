import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { TOKEN_KEY } from "../lib/token";
import { validToken } from "./mocks/server";

function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("app smoke flows", () => {
  test("redirects protected route to login when token is missing", async () => {
    renderAt("/dashboard");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
    });
  });

  test("logs in and stores token", async () => {
    renderAt("/login");

    fireEvent.click(screen.getByRole("button", { name: /login as admin/i }));

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "alice" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
    });

    expect(localStorage.getItem(TOKEN_KEY)).toBe(validToken);
  });

  test("loads health widget on dashboard", async () => {
    localStorage.setItem(TOKEN_KEY, validToken);
    renderAt("/dashboard");

    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("HEALTHY")).toBeInTheDocument();
    });
  });

  test("creates a user from admin-protected create form", async () => {
    localStorage.setItem(TOKEN_KEY, validToken);
    renderAt("/users/create");

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "newuser" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "newuser@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: "patient" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "pass1234" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create user/i }));

    await waitFor(() => {
      expect(screen.getByText(/created user #1/i)).toBeInTheDocument();
    });
  });
});
