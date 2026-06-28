import React, { useState, useEffect } from 'react';
import { useAddMahasiswa, useUpdateMahasiswa } from '@/Utils/apiHooks';
import toast from 'react-hot-toast';

const MahasiswaModal = ({ isOpen, onClose, editData }) => {
  const [formData, setFormData] = useState({
    nim: '',
    nama: '',
    tugas: '',
    uts: '',
    uas: '',
    status: true // true = Aktif, false = Tidak Aktif
  });

  const addMutation = useAddMahasiswa();
  const updateMutation = useUpdateMahasiswa();

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ nim: '', nama: '', tugas: '', uts: '', uas: '', status: true });
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editData) {
      updateMutation.mutate({ id: editData.id, ...formData }, {
        onSuccess: () => { toast.success('Data Mahasiswa diperbarui!'); onClose(); }
      });
    } else {
      addMutation.mutate(formData, {
        onSuccess: () => { toast.success('Mahasiswa baru ditambahkan!'); onClose(); }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            {editData ? `Edit Mahasiswa — ${editData.nim}` : 'Tambah Mahasiswa'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Modal Body (Form) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* NIM */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">NIM</label>
            <input 
              type="text" 
              name="nim" 
              value={formData.nim} 
              onChange={handleChange} 
              required 
              disabled={!!editData}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${editData ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
            />
            {editData && <p className="text-xs text-gray-400 mt-1">NIM tidak dapat diubah.</p>}
          </div>

          {/* Nama Mahasiswa */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Mahasiswa</label>
            <input 
              type="text" 
              name="nama" 
              value={formData.nama} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Kolom Nilai Sejajar */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tugas (30%)</label>
              <input type="number" name="tugas" value={formData.tugas} onChange={handleChange} required min="0" max="100" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">UTS (30%)</label>
              <input type="number" name="uts" value={formData.uts} onChange={handleChange} required min="0" max="100" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">UAS (40%)</label>
              <input type="number" name="uas" value={formData.uas} onChange={handleChange} required min="0" max="100" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Checkbox Status */}
          <div className="pt-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status Mahasiswa</label>
            <div className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                name="status" 
                checked={formData.status} 
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className={`px-2 py-1 rounded text-xs font-bold ${formData.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {formData.status ? 'Aktif — true' : 'Tidak Aktif — false'}
              </span>
              <span className="text-xs text-gray-400">centang = true, kosong = false</span>
            </div>
          </div>

          {/* Modal Footer (Buttons) */}
          <div className="flex justify-end space-x-3 pt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 font-medium transition-colors">
              Batal
            </button>
            <button type="submit" disabled={addMutation.isLoading || updateMutation.isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal;