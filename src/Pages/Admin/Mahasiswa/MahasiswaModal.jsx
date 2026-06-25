import React, { useState, useEffect } from 'react';
import { useAddMahasiswa, useUpdateMahasiswa } from '@/Utils/apiHooks';
import toast from 'react-hot-toast';

const MahasiswaModal = ({ isOpen, onClose, editData, mhsList }) => {
  const [formData, setFormData] = useState({ nim: '', nama: '', tugas: '', uts: '', uas: '', status: true });
  const [errors, setErrors] = useState({});

  const addMutation = useAddMahasiswa();
  const updateMutation = useUpdateMahasiswa();

  useEffect(() => {
    if (editData) setFormData({ ...editData });
    else setFormData({ nim: '', nama: '', tugas: '', uts: '', uas: '', status: true });
    setErrors({});
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!formData.nim.trim()) e.nim = "NIM wajib diisi.";
    else if (!editData && mhsList.some((m) => m.nim === formData.nim.trim())) e.nim = "NIM sudah terdaftar.";
    if (!formData.nama.trim()) e.nama = "Nama wajib diisi.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) return setErrors(validationErrors);

    const payload = { ...formData, tugas: Number(formData.tugas), uts: Number(formData.uts), uas: Number(formData.uas) };

    if (editData) updateMutation.mutate({ id: editData.id, ...payload }, { onSuccess: () => { toast.success('Diperbarui!'); onClose(); }});
    else addMutation.mutate(payload, { onSuccess: () => { toast.success('Ditambahkan!'); onClose(); }});
  };

  const isSubmitting = addMutation.isPending || updateMutation.isPending;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-[500px] p-6">
        <h2 className="text-xl font-bold mb-4">{editData ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-bold text-gray-700 mb-1">NIM</label><input type="text" name="nim" value={formData.nim} onChange={handleChange} disabled={!!editData} required className="w-full px-3 py-2 border rounded-md" />{errors.nim && <p className="text-xs text-red-500 mt-1">{errors.nim}</p>}</div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Nama</label><input type="text" name="nama" value={formData.nama} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />{errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama}</p>}</div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-sm font-bold mb-1">Tugas</label><input type="number" name="tugas" value={formData.tugas} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-bold mb-1">UTS</label><input type="number" name="uts" value={formData.uts} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" /></div>
            <div><label className="block text-sm font-bold mb-1">UAS</label><input type="number" name="uas" value={formData.uas} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">{isSubmitting ? 'Simpan...' : 'Simpan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default MahasiswaModal;