import { Outlet } from "react-router-dom";
import Sidebar from "@/Pages/Admin/Components/Sidebar";
import Header  from "@/Pages/Admin/Components/Header";
import Footer  from "@/Pages/Admin/Components/Footer";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
