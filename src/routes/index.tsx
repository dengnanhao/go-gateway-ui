import { createBrowserRouter, Navigate } from "react-router";
import Layout from "@/layouts";
import Dashboard from "@/pages/dashboard";
import Services from "@/pages/services";
import Login from "@/pages/login";

export default createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "services",
        element: <Services />,
      },
    ],
  },
]);
