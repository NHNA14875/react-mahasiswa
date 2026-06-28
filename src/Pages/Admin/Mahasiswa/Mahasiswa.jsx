import React, { useState } from 'react';
import { useMahasiswa, useDeleteMahasiswa } from '@/Utils/apiHooks';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import MahasiswaModal from './MahasiswaModal';
import Pagination from '@/Pages/Layouts/Components/Pagination';

const Mahasiswa = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: mhsList = [], isLoading, isError } = useMahasiswa();
  const deleteMutation = useDeleteMahasiswa();

  // --- LOGIKA PERHITUNGAN NILAI OTOMATIS ---
  const calculateGrades = (tugas, uts, uas) => {
    const na = (Number(tugas) * 0.3) + (Number(uts) * 0.3) + (Number(uas) * 0.4);
    let grade = 'E', ips = 0.00, color = 'bg-red-100 text-red-700';
    if (na >= 85) { grade = 'A'; ips = 4.00; color = 'bg-green-100 text-green-700'; }
    else if (na >= 70) { grade = 'B'; ips = 3.00; color = 'bg-blue-100 text-blue-700'; }
    else if (na >= 55) { grade = 'C'; ips = 2.00; color = 'bg-yellow-100 text-yellow-700'; }
    else if (na >= 40) { grade = 'D'; ips = 1.00; color = 'bg-orange-100 text-orange-700'; }
    return { na: na.toFixed(1), grade, ips: ips.toFixed(2), color };
  };

  // --- LOGIKA RINGKASAN DATA (SUMMARY CARDS) ---
  const totalMhs = mhsList.length;
  const mhsAktif = mhsList.filter(m => m.status === true).length;
  const mhsTidakAktif = mhsList.filter(m => m.status === false).length;
  const avgIPS = totalMhs > 0 
    ? (mhsList.reduce((acc, curr) => acc + Number(calculateGrades(curr.tugas, curr.uts, curr.uas).ips), 0) / totalMhs).toFixed(2)
    : "0.00";

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(mhsList.length / itemsPerPage);
  const currentData = mhsList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit = (data) => { setEditData(data); setIsModalOpen(true); };

  const handleDelete = (id) => {
    Swal.fire({ title: 'Hapus Mahasiswa?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6', confirmButtonText: 'Ya, hapus!' })
      .then((result) => {
        if (result.isConfirmed) deleteMutation.mutate(id, { onSuccess: () => toast.success("Mahasiswa dihapus!") });
      });
  };

  return (
    <div className="space-y-6">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-600">{totalMhs}</h2>
          <p className="text-gray-500 text-sm mt-1">Total</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-green-500">{mhsAktif}</h2>
          <p className="text-gray-500 text-sm mt-1">Aktif</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-red-500">{mhsTidakAktif}</h2>
          <p className="text-gray-500 text-sm mt-1">Tidak Aktif</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-orange-500">{avgIPS}</h2>
          <p className="text-gray-500 text-sm mt-1">Rata-rata IPS</p>
        </div>
      </div>

      {/* TABEL UTAMA */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Daftar Mahasiswa</h1>
          <button onClick={() => { setEditData(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition-colors">
            + Tambah Mahasiswa
          </button>
        </div>

        {isLoading ? <div className="text-center py-4">Memuat data...</div> : isError ? <div className="text-center py-4 text-red-500">Error API</div> : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold w-12">No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">NIM</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Tugas</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">UTS</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">UAS</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Nilai Akhir</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Grade</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">IPS</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentData.length > 0 ? currentData.map((m, index) => {
                    const result = calculateGrades(m.tugas, m.uts, m.uas);
                    return (
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-400">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{m.nim}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">{m.nama}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">{m.tugas}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">{m.uts}</td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">{m.uas}</td>
                        <td className="px-4 py-3 text-sm text-center font-bold text-gray-800">{result.na}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${result.color}`}>{result.grade}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600">{result.ips}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${m.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {m.status ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center space-x-1">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors">Detail</button>
                          <button onClick={() => handleEdit(m)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition-colors">Edit</button>
                          <button onClick={() => handleDelete(m.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">Hapus</button>
                        </td>
                      </tr>
                    );
                  }) : <tr><td colSpan="11" className="text-center py-6 text-gray-500">Belum ada data Mahasiswa.</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}
      </div>
      <MahasiswaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editData={editData} />
    </div>
  );
};

export default Mahasiswa;