import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMataKuliah, useDosen, useMahasiswa, useKelas } from '@/Utils/apiHooks';

const KelasModal = ({ isOpen, onClose, editData, refreshData, apiUrl }) => {
  const MAX_SKS_DOSEN = 12;
  const MAX_SKS_MHS = 24;

  const [formData, setFormData] = useState({
    nama_kelas: '',
    mata_kuliah_id: '',
    dosen_id: '',
    mahasiswa_ids: [] 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mengambil semua data referensi
  const { data: mkList = [] } = useMataKuliah();
  const { data: dosenList = [] } = useDosen();
  const { data: mhsList = [] } = useMahasiswa();
  const { data: kelasList = [] } = useKelas(); 

  useEffect(() => {
    if (editData) {
      setFormData({
        nama_kelas: editData.nama_kelas || '',
        mata_kuliah_id: editData.mata_kuliah_id || '',
        dosen_id: editData.dosen_id || '',
        mahasiswa_ids: editData.mahasiswa_ids || []
      });
    } else {
      setFormData({ nama_kelas: '', mata_kuliah_id: '', dosen_id: '', mahasiswa_ids: [] });
    }
  }, [editData, isOpen]);

  // --- LOGIKA PERHITUNGAN SKS ---
  const mkMap = {};
  mkList.forEach(mk => mkMap[mk.id] = Number(mk.sks));
  
  const currentSelectedMkSks = mkMap[formData.mata_kuliah_id] || 0;

  const getDosenSks = (dosenId) => {
    return kelasList.reduce((total, k) => {
      if (String(k.dosen_id) === String(dosenId) && k.id !== editData?.id) {
        return total + (mkMap[k.mata_kuliah_id] || 0);
      }
      return total;
    }, 0);
  };

  const getMhsSks = (mhsId) => {
    return kelasList.reduce((total, k) => {
      if (k.mahasiswa_ids?.includes(String(mhsId)) && k.id !== editData?.id) {
        return total + (mkMap[k.mata_kuliah_id] || 0);
      }
      return total;
    }, 0);
  };

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (mhsId) => {
    const stringId = String(mhsId);
    setFormData(prev => {
      const isSelected = prev.mahasiswa_ids.includes(stringId);
      if (isSelected) {
        return { ...prev, mahasiswa_ids: prev.mahasiswa_ids.filter(id => id !== stringId) };
      } else {
        return { ...prev, mahasiswa_ids: [...prev.mahasiswa_ids, stringId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mata_kuliah_id || !formData.dosen_id) {
      toast.error("Mata Kuliah dan Dosen wajib dipilih!"); return;
    }

    setIsSubmitting(true);
    try {
      if (editData) {
        // PERBAIKAN: Gunakan formData dan tambahkan .json
        await axios.put(`${apiUrl}/${editData.id}.json`, formData);
        toast.success(`Kelas berhasil diperbarui!`);
      } else {
        // PERBAIKAN: Gunakan formData dan tambahkan .json
        await axios.post(`${apiUrl}.json`, formData);
        toast.success(`Kelas berhasil dibuat!`);
      }
      refreshData();
      onClose();
    } catch (error) { 
      toast.error('Gagal menyimpan data.'); 
      console.error(error);
    } 
    finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{editData ? 'Kelola Data Kelas' : 'Buat Kelas Baru'}</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">Nama Kelas</label>
              <input type="text" name="nama_kelas" value={formData.nama_kelas} onChange={handleChange} required placeholder="Contoh: A11.4601"
                className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300" />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1">Pilih Mata Kuliah</label>
              <select name="mata_kuliah_id" value={formData.mata_kuliah_id} onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300">
                <option value="">-- Pilih MK --</option>
                {mkList.map(mk => (
                  <option key={mk.id} value={mk.id}>{mk.nama_mk} ({mk.sks} SKS)</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Dosen Pengampu <span className="text-xs font-normal text-gray-500">(Maks {MAX_SKS_DOSEN} SKS)</span>
            </label>
            <select name="dosen_id" value={formData.dosen_id} onChange={handleChange} required disabled={!formData.mata_kuliah_id}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:border-blue-300">
              <option value="">{formData.mata_kuliah_id ? "-- Pilih Dosen --" : "-- Pilih MK Terlebih Dahulu --"}</option>
              {dosenList.map(dosen => {
                const currentSks = getDosenSks(dosen.id);
                const isOverload = (currentSks + currentSelectedMkSks) > MAX_SKS_DOSEN;
                const isCurrentDosen = editData && String(editData.dosen_id) === String(dosen.id);
                
                return (
                  <option key={dosen.id} value={dosen.id} disabled={isOverload && !isCurrentDosen}>
                    {dosen.nama} (Terpakai: {currentSks} SKS) {isOverload && !isCurrentDosen ? ' - PENUH' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="border-t pt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Pilih Mahasiswa <span className="text-xs font-normal text-gray-500">(Maks {MAX_SKS_MHS} SKS per Mahasiswa)</span>
            </label>
            
            <div className="border rounded-md max-h-48 overflow-y-auto bg-gray-50 p-2 space-y-1">
              {!formData.mata_kuliah_id ? (
                <div className="text-sm text-gray-500 p-2 text-center">Pilih Mata Kuliah terlebih dahulu untuk menghitung SKS.</div>
              ) : mhsList.length === 0 ? (
                <div className="text-sm text-gray-500 p-2">Belum ada data mahasiswa.</div>
              ) : (
                mhsList.map(mhs => {
                  const mhsIdStr = String(mhs.id);
                  const isChecked = formData.mahasiswa_ids.includes(mhsIdStr);
                  const mhsCurrentSks = getMhsSks(mhs.id);
                  const projectedSks = mhsCurrentSks + currentSelectedMkSks;
                  
                  const isOverload = projectedSks > MAX_SKS_MHS;
                  const isDisabled = isOverload && !isChecked;

                  return (
                    <label key={mhs.id} className={`flex items-center justify-between p-2 rounded border ${isChecked ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-100'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(mhs.id)}
                          disabled={isDisabled}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{mhs.nim} - {mhs.nama}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${isOverload && !isChecked ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                        SKS: {mhsCurrentSks} / {MAX_SKS_MHS}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Total Mahasiswa Dipilih: <span className="font-bold text-blue-600">{formData.mahasiswa_ids.length}</span> Orang</p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Kelas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KelasModal;