import React, { useState } from 'react';
import { useMataKuliah, useDeleteMataKuliah } from '@/Utils/apiHooks';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import MataKuliahModal from './MataKuliahModal';

const MataKuliah = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const { data: mkList = [], isLoading, isError } = useMataKuliah();
  const deleteMutation = useDeleteMataKuliah();

  const handleEdit = (data) => { setEditData(data); setIsModalOpen(true); };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Mata Kuliah?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id, { onSuccess: () => toast.success("Dihapus!") });
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Mata Kuliah</h1>
        <button onClick={() => { setEditData(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold">
          + Tambah MK
        </button>
      </div>

      {isLoading ? <div className="text-center py-4">Memuat data...</div> : isError ? <div className="text-center py-4 text-red-500">Error</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Kode</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">Nama MK</th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">SKS</th>
                <th className="px-6 py-3 border-b text-center text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mkList.length > 0 ? mkList.map((mk) => (
                <tr key={mk.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{mk.kode_mk}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{mk.nama_mk}</td>
                  <td className="px-6 py-4 border-b text-sm text-gray-700">{mk.sks}</td>
                  <td className="px-6 py-4 border-b text-sm text-center">
                    <button onClick={() => handleEdit(mk)} className="text-blue-600 hover:text-blue-800 mr-3 font-semibold">Edit</button>
                    <button onClick={() => handleDelete(mk.id)} className="text-red-500 hover:text-red-700 font-semibold">Hapus</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="4" className="text-center py-4 text-gray-500">Belum ada data.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <MataKuliahModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editData={editData} />
    </div>
  );
};
export default MataKuliah;