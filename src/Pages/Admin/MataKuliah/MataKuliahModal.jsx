import React, { useState, useEffect } from 'react';
import { useAddMataKuliah, useUpdateMataKuliah } from '@/Utils/apiHooks';
import toast from 'react-hot-toast';

const MataKuliahModal = ({ isOpen, onClose, editData }) => {
  const [formData, setFormData] = useState({ kode_mk: '', nama_mk: '', sks: '' });
  const addMutation = useAddMataKuliah();
  const updateMutation = useUpdateMataKuliah();

  useEffect(() => {
    if (editData) setFormData({ kode_mk: editData.kode_mk, nama_mk: editData.nama_mk, sks: editData.sks });
    else setFormData({ kode_mk: '', nama_mk: '', sks: '' });
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
        <h2 className="text-xl font-bold mb-4">{editData ? 'Edit MK' : 'Tambah MK'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Kode MK</label><input type="text" name="kode_mk" value={formData.kode_mk} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Nama MK</label><input type="text" name="nama_mk" value={formData.nama_mk} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">SKS</label><input type="number" name="sks" value={formData.sks} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">{isSubmitting ? 'Simpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default MataKuliahModal;