import React, { useState } from 'react';
import { useDosen, useDeleteDosen } from '@/Utils/apiHooks';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import DosenModal from './DosenModal';
import Pagination from '@/Pages/Layouts/Components/Pagination';

const Dosen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const { data: dosenList = [], isLoading, isError } = useDosen();
  const deleteMutation = useDeleteDosen();

  const totalPages = Math.ceil(dosenList.length / itemsPerPage);
  const currentData = dosenList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit = (data) => { setEditData(data); setIsModalOpen(true); };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Dosen?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id, { onSuccess: () => toast.success("Dosen berhasil dihapus!") });
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Data Dosen</h1>
        <button onClick={() => { setEditData(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition-colors">
          + Tambah Dosen
        </button>
      </div>

      {isLoading ? <div className="text-center py-4">Memuat data...</div> : isError ? <div className="text-center py-4 text-red-500">Gagal memuat API</div> : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-12">No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">NIDN</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nama Dosen</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentData.length > 0 ? currentData.map((dosen, index) => (
                  <tr key={dosen.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{dosen.nidn}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{dosen.nama}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{dosen.email}</td>
                    <td className="px-4 py-3 text-sm text-center space-x-1">
                      <button onClick={() => handleEdit(dosen)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition-colors">Edit</button>
                      <button onClick={() => handleDelete(dosen.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">Hapus</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="5" className="text-center py-6 text-gray-500">Belum ada data Dosen.</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
      <DosenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editData={editData} />
    </div>
  );
};

export default Dosen;