import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Import Swal Helper 
import { confirmLogout } from "@/Helpers/SwalHelper";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Konfirmasi Logout menggunakan Swal2
  const handleLogout = async () => {
    const confirmed = await confirmLogout(); // ← Swal: konfirmasi logout
    if (!confirmed) return;
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Mahasiswa</h1>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none cursor-pointer"
          />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-10">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
