import { useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { createAppRouter } from "./router";

function App() {
  const router = useMemo(() => createAppRouter(), []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
