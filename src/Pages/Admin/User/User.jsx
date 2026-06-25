import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import UserTable from './UserTable';
import UserModal from './UserModal';

const User = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Kita mengambil data dari endpoint register tempat user mendaftar
  const API_URL = 'http://localhost:8000/register'; 

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setUserList(response.data); 
    } catch (error) {
      toast.error('Gagal mengambil data User');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          await axios.delete(`${API_URL}/${id}`);
          toast.success('User berhasil dihapus');
          fetchData();
        } catch (error) {
          toast.error('Gagal menghapus user');
        }
      }
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen User (Role & Permission)</h1>
      </div>

      <UserTable 
        data={userList} 
        isLoading={isLoading} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

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