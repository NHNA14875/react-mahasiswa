import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import UserModal from './UserModal';
import Pagination from '@/Pages/Layouts/Components/Pagination';

const User = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. UBAH API URL: Arahkan ke Firebase dan tambahkan /register
  const API_URL = 'https://rm-api-86a4e-default-rtdb.asia-southeast1.firebasedatabase.app/register'; 

  // --- LOGIKA HAK AKSES (RBAC) ---
  const loggedInUser = JSON.parse(localStorage.getItem('userSession')) || { permission: 'Full Access' };
  
  const isReadOnly = loggedInUser.permission === 'Read Only';
  const isEditor = loggedInUser.permission === 'Editor';
  const isFullAccess = loggedInUser.permission === 'Full Access';

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 2. TAMBAH .json: Untuk mengambil data dari Firebase
      const response = await axios.get(`${API_URL}.json`);
      
      // 3. KONVERSI DATA: Firebase mengembalikan Object, kita ubah jadi Array agar tidak error di .map()
      const fetchedData = response.data 
        ? Object.keys(response.data).map(key => ({
            id: key, 
            ...response.data[key]
          }))
        : [];
        
      setUserList(fetchedData); 
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data user!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(userList.length / itemsPerPage);
  const currentData = userList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit = (data) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Hapus User?',
      text: "User ini tidak akan bisa login lagi!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 4. TAMBAH .json: Untuk menghapus data spesifik di Firebase
          await axios.delete(`${API_URL}/${id}.json`);
          toast.success("User berhasil dihapus!");
          fetchData(); 
        } catch (error) {
          toast.error("Gagal menghapus user.");
        }
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Manajemen User (Role & Permission)</h1>
        
        {/* Tombol Tambah hanya muncul jika BUKAN Read Only */}
        {!isReadOnly && (
          <button onClick={() => { setEditData(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition-colors">
            + Tambah User
          </button>
        )}
      </div>

      {isLoading ? <div className="text-center py-4">Memuat data...</div> : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-12">No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Role</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Permission</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentData.length > 0 ? currentData.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{user.name || user.nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : user.role === 'Dosen' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600">{user.permission || 'Read Only'}</td>
                    <td className="px-4 py-3 text-sm text-center space-x-1">
                      
                      {/* Logika Keamanan Tombol Aksi */}
                      {isReadOnly ? (
                        <span className="text-xs text-gray-400 italic">Tidak ada akses</span>
                      ) : (
                        <>
                          {/* Editor & Full Access bisa Edit */}
                          {(isEditor || isFullAccess) && (
                            <button onClick={() => handleEdit(user)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition-colors">Edit</button>
                          )}
                          
                          {/* HANYA Full Access yang bisa Hapus */}
                          {isFullAccess && (
                            <button onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">Hapus</button>
                          )}
                        </>
                      )}

                    </td>
                  </tr>
                )) : <tr><td colSpan="6" className="text-center py-6 text-gray-500">Belum ada data User.</td></tr>}
              </tbody>
            </table>
          </div>
          
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {isModalOpen && (
        <UserModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          editData={editData} 
          refreshData={fetchData} 
          apiUrl={API_URL}
        />
      )}
    </div>
  );
};

export default User;