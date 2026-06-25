import React, { useState } from 'react';
import { useKelas, useDeleteKelas } from '@/Utils/apiHooks';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import KelasModal from './KelasModal';

const Kelas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const { data: kelasList = [], isLoading, isError } = useKelas();
  const deleteMutation = useDeleteKelas();

  const handleEdit = (data) => { setEditData(data); setIsModalOpen(true); };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Kelas?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id, { onSuccess: () => toast.success("Kelas dihapus!") });
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Kelas</h1>
        <button onClick={() => { setEditData(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold">
          + Tambah Kelas
        </button>
      </div>

      {isLoading ? <div className="text-center py-4">Memuat data...</div> : isError ? <div className="text-center py-4 text-red-500">Error API</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Nama Kelas</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Ruangan</th>
                <th className="px-6 py-3 border-b text-center text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kelasList.length > 0 ? kelasList.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{k.nama_kelas}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{k.ruangan}</td>
                  <td className="px-6 py-4 border-b text-sm text-center">
                    <button onClick={() => handleEdit(k)} className="text-blue-600 hover:text-blue-800 mr-3 font-semibold">Edit</button>
                    <button onClick={() => handleDelete(k.id)} className="text-red-500 hover:text-red-700 font-semibold">Hapus</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="3" className="text-center py-4 text-gray-500">Belum ada Kelas.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <KelasModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editData={editData} />
    </div>
  );
};
export default Kelas;