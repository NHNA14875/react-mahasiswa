import React from 'react';

const MataKuliahTable = ({ data, isLoading, onEdit, onDelete }) => {
  if (isLoading) return <div className="text-center py-4">Memuat data...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">No</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Kode MK</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Mata Kuliah</th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">SKS</th>
            <th className="px-6 py-3 border-b border-gray-200 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((mk, index) => (
              <tr key={mk.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700 text-left">{mk.kode_mk}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{mk.nama_mk}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">{mk.sks}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-center">
                  <button onClick={() => onEdit(mk)} className="text-yellow-500 hover:text-yellow-700 mr-3">Edit</button>
                  <button onClick={() => onDelete(mk.id)} className="text-red-500 hover:text-red-700">Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Tidak ada data Mata Kuliah.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MataKuliahTable;