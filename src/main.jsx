import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ← setup Toast pada file utama React

import "./App.css";

import AuthLayout      from "@/Pages/Layouts/AuthLayout";
import AdminLayout     from "@/Pages/Layouts/AdminLayout";
import ProtectedRoute  from "@/Pages/Admin/Components/ProtectedRoute";

import Login            from "@/Pages/Auth/Login/Login";
import Dashboard        from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa        from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail  from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import PageNotFound     from "@/Pages/Error/PageNotFound";

const DUMMY_MAHASISWA = [
  { nim: "20211001", nama: "Budi Santoso",  tugas: 85, uts: 80, uas: 88, status: true  },
  { nim: "20211002", nama: "Siti Aminah",   tugas: 90, uts: 85, uas: 92, status: true  },
  { nim: "20211003", nama: "Raka Pratama",  tugas: 70, uts: 65, uas: 72, status: false },
  { nim: "20211004", nama: "Dewi Lestari",  tugas: 60, uts: 55, uas: 58, status: true  },
  { nim: "20211005", nama: "Fajar Nugroho", tugas: 95, uts: 92, uas: 96, status: false },
];

const App = () => {
  const [mahasiswa, setMahasiswa] = useState(DUMMY_MAHASISWA);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      children: [{ index: true, element: <Login /> }],
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
        { path: "dashboard",  element: <Dashboard mahasiswa={mahasiswa} /> },
        {
          path: "mahasiswa",
          children: [
            { index: true, element: <Mahasiswa mahasiswa={mahasiswa} setMahasiswa={setMahasiswa} /> },
            { path: ":nim",  element: <MahasiswaDetail mahasiswa={mahasiswa} /> },
          ],
        },
      ],
    },
    { path: "*", element: <PageNotFound /> },
  ]);

  return (
    <>
      {/* Toaster: setup global Toast di file utama React */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <RouterProvider router={router} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
