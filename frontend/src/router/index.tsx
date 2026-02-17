import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import { AssignPatientPage } from "../pages/AssignPatientPage";
import { DashboardPage } from "../pages/DashboardPage";
import { DoctorPatientsPage } from "../pages/DoctorPatientsPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PatientDoctorsPage } from "../pages/PatientDoctorsPage";
import { UserActionsPage } from "../pages/UserActionsPage";
import { UserCreatePage } from "../pages/UserCreatePage";
import { UserDetailPage } from "../pages/UserDetailPage";
import { UserListPage } from "../pages/UserListPage";
import { UserPatchPage } from "../pages/UserPatchPage";
import { UserUpdatePage } from "../pages/UserUpdatePage";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function HomeRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export function createAppRouter() {
  return createBrowserRouter([
    {
      path: "/",
      element: <HomeRedirect />,
    },
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/users/create",
          element: <UserCreatePage />,
        },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          element: <AppLayout />,
          children: [
            {
              path: "/dashboard",
              element: <DashboardPage />,
            },
            {
              path: "/users",
              element: <UserListPage />,
            },
            {
              path: "/users/:id",
              element: <UserDetailPage />,
            },
            {
              path: "/users/:id/update",
              element: <UserUpdatePage />,
            },
            {
              path: "/users/:id/patch",
              element: <UserPatchPage />,
            },
            {
              path: "/users/:id/actions",
              element: <UserActionsPage />,
            },
            {
              path: "/assignments/new",
              element: <AssignPatientPage />,
            },
            {
              path: "/assignments/doctor",
              element: <DoctorPatientsPage />,
            },
            {
              path: "/assignments/patient",
              element: <PatientDoctorsPage />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
}
