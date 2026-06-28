import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useKelas, useMataKuliah, useDosen } from '@/Utils/apiHooks';
import KelasModal from './KelasModal';
import Pagination from '@/Pages/Layouts/Components/Pagination';

const Kelas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. UBAH BAGIAN INI: Ganti dengan URL Firebase-mu (tanpa tanda / di akhir)
  const API_URL = 'https://rm-api-86a4e-default-rtdb.asia-southeast1.firebasedatabase.app/kelas'; // Contoh: https://NAMA-PROJECT-KAMU.firebasedatabase.app/kelas

  // Mengambil data menggunakan React Query
  const { data: kelasList = [], isLoading, isError, refetch } = useKelas();
  const { data: mkList = [] } = useMataKuliah();
  const { data: dosenList = [] } = useDosen();

  const totalPages = Math.ceil(kelasList.length / itemsPerPage);
  const currentData = kelasList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Helper untuk mendapatkan nama MK dan Dosen dari ID
  const getMkName = (id) => mkList.find(mk => String(mk.id) === String(id))?.nama_mk || 'MK Tidak Ditemukan';
  const getMkSks = (id) => mkList.find(mk => String(mk.id) === String(id))?.sks || 0;
  const getDosenName = (id) => dosenList.find(d => String(d.id) === String(id))?.nama || 'Dosen Tidak Ditemukan';

  const handleEdit = (data) => { setEditData(data); setIsModalOpen(true); };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Kelas?', text: "Data mahasiswa di kelas ini akan ikut terhapus dari kelas!", icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Ya, hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 2. UBAH BAGIAN INI: Wajib ditambahkan .json di akhir URL untuk Firebase
          await axios.delete(`${API_URL}/${id}.json`);
          toast.success("Kelas berhasil dihapus!");
          refetch();
        } catch (error) { toast.error("Gagal menghapus kelas."); }
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Manajemen Kelas & SKS</h1>
        <button onClick={() => { setEditData(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition-colors">
          + Tambah Kelas
        </button>
      </div>

      {isLoading ? <div className="text-center py-4">Memuat data...</div> : isError ? <div className="text-center py-4 text-red-500">Error API</div> : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-12">No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nama Kelas</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Mata Kuliah (SKS)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Dosen Pengampu</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Jml Mahasiswa</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentData.length > 0 ? currentData.map((kelas, index) => (
                  <tr key={kelas.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-400">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-800">{kelas.nama_kelas}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {getMkName(kelas.mata_kuliah_id)} <span className="text-blue-600 font-semibold">({getMkSks(kelas.mata_kuliah_id)} SKS)</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getDosenName(kelas.dosen_id)}</td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-gray-600">
                      {kelas.mahasiswa_ids?.length || 0} Orang
                    </td>
                    <td className="px-4 py-3 text-sm text-center space-x-1">
                      <button onClick={() => handleEdit(kelas)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition-colors">Edit / Kelola</button>
                      <button onClick={() => handleDelete(kelas.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">Hapus</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="6" className="text-center py-6 text-gray-500">Belum ada data Kelas.</td></tr>}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}

      {isModalOpen && (
        <KelasModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editData={editData} refreshData={refetch} apiUrl={API_URL} />
      )}
    </div>
  );
};

export default Kelas;