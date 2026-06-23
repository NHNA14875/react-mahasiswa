import { useState, useEffect } from "react";
import Modal  from "@/Pages/Layouts/Components/Modal";
import Input  from "@/Pages/Layouts/Components/Input";
import Label  from "@/Pages/Layouts/Components/Label";
import Button from "@/Pages/Layouts/Components/Button";
import Form   from "@/Pages/Layouts/Components/Form";

// ── Import Helpers 
import { confirmUpdate }                          from "@/Helpers/SwalHelper";
import { toastUpdateSuccess, toastUpdateFailed }  from "@/Helpers/ToastHelper";

const EMPTY_FORM = { nim: "", nama: "", tugas: "", uts: "", uas: "", status: true };

const MahasiswaModal = ({ isModalOpen, onClose, onSubmit, selectedMahasiswa, mahasiswa }) => {

  // state form
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // ── useEffect: sinkronkan form dengan selectedMahasiswa 
  useEffect(() => {
    if (selectedMahasiswa) {
      // selectedMahasiswa ada → isi form (mode edit)
      setForm({
        nim:    selectedMahasiswa.nim,
        nama:   selectedMahasiswa.nama,
        tugas:  String(selectedMahasiswa.tugas),
        uts:    String(selectedMahasiswa.uts),
        uas:    String(selectedMahasiswa.uas),
        status: selectedMahasiswa.status,
      });
    } else {
      // selectedMahasiswa null → kosongkan form (mode tambah)
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [selectedMahasiswa, isModalOpen]);

  // ── Kondisi: isModalOpen false → return null 
  if (!isModalOpen) return null;

  // ── handleChange 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Validasi 
  const validate = () => {
    const e = {};
    if (!form.nim.trim()) {
      e.nim = "NIM wajib diisi.";
    } else if (!/^\d+$/.test(form.nim.trim())) {
      e.nim = "NIM hanya boleh berisi angka.";
    } else if (!selectedMahasiswa && mahasiswa.some((m) => m.nim === form.nim.trim())) {
      e.nim = "NIM sudah terdaftar. Gunakan NIM yang berbeda.";
    }
    if (!form.nama.trim()) {
      e.nama = "Nama wajib diisi.";
    } else if (form.nama.trim().length < 3) {
      e.nama = "Nama minimal 3 karakter.";
    }
    for (const field of ["tugas", "uts", "uas"]) {
      const label = field === "tugas" ? "Tugas" : field.toUpperCase();
      if (form[field] === "" || form[field] === null || form[field] === undefined) {
        e[field] = `Nilai ${label} wajib diisi.`;
      } else {
        const v = Number(form[field]);
        if (isNaN(v) || v < 0 || v > 100) e[field] = `Nilai ${label} harus antara 0–100.`;
      }
    }
    return e;
  };

  // ── handleSubmit: validasi → onSubmit(form) → onClose ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    // trigger form — validasi dulu
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = {
      nim:    form.nim.trim(),
      nama:   form.nama.trim(),
      tugas:  Number(form.tugas),
      uts:    Number(form.uts),
      uas:    Number(form.uas),
      status: Boolean(form.status),
    };

    if (selectedMahasiswa) {
      // MODE EDIT: konfirmasi dengan Swal2 sebelum simpan
      const confirmed = await confirmUpdate(formData.nama, formData.nim); // ← Swal: konfirmasi update
      if (!confirmed) return; // batal → tetap di form

      try {
        onSubmit(formData);                       // panggil onSubmit dengan state form
        toastUpdateSuccess(formData.nama);        // ← Toast: update berhasil
      } catch {
        toastUpdateFailed();                      // ← Toast: update gagal
        return;
      }
    } else {
      // MODE TAMBAH: langsung panggil onSubmit
      onSubmit(formData);
    }

    onClose(); // panggil onClose setelah selesai
  };

  // ── Render ──
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title={selectedMahasiswa ? `Edit Mahasiswa — ${selectedMahasiswa.nim}` : "Tambah Mahasiswa"}
      size="md"
    >
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">

          {/* NIM */}
          <div>
            <Label htmlFor="nim">NIM</Label>
            <Input
              type="text"
              name="nim"
              placeholder="Contoh: 20211006"
              value={form.nim}
              onChange={handleChange}
              disabled={!!selectedMahasiswa}
            />
            {errors.nim        && <p className="mt-1 text-xs text-red-500">⚠ {errors.nim}</p>}
            {selectedMahasiswa && <p className="mt-1 text-xs text-gray-400">NIM tidak dapat diubah.</p>}
          </div>

          {/* Nama */}
          <div>
            <Label htmlFor="nama">Nama Mahasiswa</Label>
            <Input
              type="text"
              name="nama"
              placeholder="Masukkan nama lengkap"
              value={form.nama}
              onChange={handleChange}
            />
            {errors.nama && <p className="mt-1 text-xs text-red-500">⚠ {errors.nama}</p>}
          </div>

          {/* Nilai: Tugas, UTS, UAS */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "tugas", label: "Tugas (30%)" },
              { name: "uts",   label: "UTS (30%)"   },
              { name: "uas",   label: "UAS (40%)"   },
            ].map((f) => (
              <div key={f.name}>
                <Label htmlFor={f.name}>{f.label}</Label>
                <Input
                  type="number"
                  name={f.name}
                  placeholder="0–100"
                  value={form[f.name]}
                  onChange={handleChange}
                  min={0}
                  max={100}
                />
                {errors[f.name] && <p className="mt-1 text-xs text-red-500">⚠ {errors[f.name]}</p>}
              </div>
            ))}
          </div>

          {/* Status */}
          <div>
            <Label>Status Mahasiswa</Label>
            <div className="mt-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm">
                  {form.status
                    ? <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Aktif — true</span>
                    : <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Tidak Aktif — false</span>
                  }
                </span>
              </label>
              <span className="text-xs text-gray-400">centang = true, kosong = false</span>
            </div>
          </div>

          {/* Tombol */}
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
            <Button type="submit" variant="primary">
              {selectedMahasiswa ? "Simpan Perubahan" : "Tambah"}
            </Button>
          </div>

        </div>
      </Form>
    </Modal>
  );
};

export default MahasiswaModal;
