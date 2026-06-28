import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserModal = ({ isOpen, onClose, editData, refreshData, apiUrl }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    permission: 'Read Only'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || editData.nama || '',
        email: editData.email || '',
        password: editData.password || '', 
        role: editData.role || 'User',
        permission: editData.permission || 'Read Only'
      });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'User', permission: 'Read Only' });
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editData) {
        // Mode Update
        await axios.put(`${apiUrl}/${editData.id}.json`, formData);
        toast.success(`Hak akses ${formData.name} berhasil diperbarui!`);
      } else {
        // Mode Tambah
        await axios.post(`${apiUrl}.json`, formData);
        toast.success(`User ${formData.name} berhasil ditambahkan!`);
      }
      refreshData();
      onClose(); 
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan data user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-[28rem] p-6">
        
        <h2 className="text-xl font-bold mb-4">
          {editData ? 'Ubah Hak Akses User' : 'Tambah User Baru'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Nama User {editData && <span className="text-xs font-normal text-red-500">(Terkunci)</span>}
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange}
              required
              disabled={!!editData} 
              className={`w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300 ${editData ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`} 
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Email {editData && <span className="text-xs font-normal text-red-500">(Terkunci)</span>}
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange}
              required
              disabled={!!editData} 
              className={`w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300 ${editData ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`} 
            />
          </div>

          {!editData && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password} 
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300 bg-white" 
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300 bg-white"
            >
              <option value="User">User Biasa</option>
              <option value="Admin">Administrator</option>
              <option value="Dosen">Dosen</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Permission</label>
            <select 
              name="permission" 
              value={formData.permission} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300 bg-white"
            >
              <option value="Read Only">Read Only (Hanya Lihat)</option>
              <option value="Editor">Editor (Bisa Tambah/Edit)</option>
              <option value="Full Access">Full Access (Bisa Hapus)</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Memproses...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;