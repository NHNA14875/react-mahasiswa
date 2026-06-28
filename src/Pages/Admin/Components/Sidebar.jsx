import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-52">
      <div className="flex justify-between items-center p-4 border-b border-blue-700">
        <span className="text-2xl font-bold">Admin</span>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <span className="text-lg">🏠</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/mahasiswa"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <span className="text-base">🎓</span>
          <span>Mahasiswa</span>
        </NavLink>

        {/* ================================================= */}
        {/* MENU DOSEN                                        */}
        {/* ================================================= */}
        <NavLink
          to="/admin/dosen"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <span className="text-base">👨‍🏫</span>
          <span>Dosen</span>
        </NavLink>

        {/* ================================================= */}
        {/* MENU MATA KULIAH                                  */}
        {/* ================================================= */}
        <NavLink
          to="/admin/matakuliah"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <span className="text-base">📚</span>
          <span>Mata Kuliah</span>
        </NavLink>

        {/* ================================================= */}
        {/* MENU BARU: MANAJEMEN KELAS                        */}
        {/* ================================================= */}
        <NavLink
          to="/admin/kelas"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <span className="text-base">🏫</span>
          <span>Kelas</span>
        </NavLink>

        {/* ================================================= */}
        {/* MENU MANAJEMEN USER                               */}
        {/* ================================================= */}
        <NavLink
          to="/admin/user"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          <span className="text-base">⚙️</span>
          <span>Manajemen User</span>
        </NavLink>
        
      </nav>
    </aside>
  );
};

export default Sidebar;