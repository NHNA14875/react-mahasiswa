import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import "./App.css";

import AuthLayout      from "@/Pages/Layouts/AuthLayout";
import AdminLayout     from "@/Pages/Layouts/AdminLayout";
import ProtectedRoute  from "@/Pages/Admin/Components/ProtectedRoute";

import Login            from "@/Pages/Auth/Login/Login";
import Dashboard        from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa        from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import PageNotFound     from "@/Pages/Error/PageNotFound";
import Register         from "@/Pages/Auth/Register/Register";
import Dosen            from "@/Pages/Admin/Dosen/Dosen";
import MataKuliah       from "@/Pages/Admin/MataKuliah/MataKuliah";
import User             from "@/Pages/Admin/User/User";
import Kelas            from "@/Pages/Admin/Kelas/Kelas";

const queryClient = new QueryClient();

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { index: true, element: <Login /> },
        { path: "register", element: <Register /> } 
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="dashboard" /> },
        { path: "dashboard",  element: <Dashboard /> },
        { path: "mahasiswa",  element: <Mahasiswa /> },
        { path: "dosen",      element: <Dosen /> },
        { path: "matakuliah", element: <MataKuliah /> },
        { path: "kelas",      element: <Kelas /> },
        { path: "user",       element: <User /> },
      ],
    },
    { path: "*", element: <PageNotFound /> },
  ], {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  });

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <RouterProvider router={router} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);