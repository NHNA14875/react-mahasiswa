import React, { useState, useEffect } from 'react';
import { useAddKelas, useUpdateKelas } from '@/Utils/apiHooks';
import toast from 'react-hot-toast';

const KelasModal = ({ isOpen, onClose, editData }) => {
  const [formData, setFormData] = useState({ nama_kelas: '', ruangan: '' });
  const addMutation = useAddKelas();
  const updateMutation = useUpdateKelas();

  useEffect(() => {
    if (editData) setFormData({ nama_kelas: editData.nama_kelas, ruangan: editData.ruangan });
    else setFormData({ nama_kelas: '', ruangan: '' });
  }, [editData, isOpen]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editData) updateMutation.mutate({ id: editData.id, ...formData }, { onSuccess: () => { toast.success('Diperbarui!'); onClose(); }});
    else addMutation.mutate(formData, { onSuccess: () => { toast.success('Ditambahkan!'); onClose(); }});
  };

  const isSubmitting = addMutation.isPending || updateMutation.isPending;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">{editData ? 'Edit Kelas' : 'Tambah Kelas'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Nama Kelas</label><input type="text" name="nama_kelas" value={formData.nama_kelas} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Ruangan</label><input type="text" name="ruangan" value={formData.ruangan} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">{isSubmitting ? 'Simpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default KelasModal;