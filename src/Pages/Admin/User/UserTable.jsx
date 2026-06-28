import React from 'react';

const UserTable = ({ data, isLoading, onEdit, onDelete }) => {
  if (isLoading) return <div className="text-center py-4">Memuat data...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600 uppercase">Nama</th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600 uppercase">Email</th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600 uppercase">Role</th>
            <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600 uppercase">Permission</th>
            <th className="px-6 py-3 border-b text-center text-sm font-semibold text-gray-600 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-sm text-gray-700 font-medium">{user.name}</td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4 border-b text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {user.role || 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-700">
                  {user.permission || 'Read Only'}
                </td>
                <td className="px-6 py-4 border-b text-sm text-center">
                  <button onClick={() => onEdit(user)} className="text-blue-600 hover:text-blue-800 mr-3 font-semibold">Ubah Akses</button>
                  <button onClick={() => onDelete(user.id)} className="text-red-500 hover:text-red-700">Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Belum ada user yang mendaftar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;