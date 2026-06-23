import { useState } from "react";
import Card    from "@/Pages/Layouts/Components/Card";
import Heading from "@/Pages/Layouts/Components/Heading";
import Button  from "@/Pages/Layouts/Components/Button";
import Modal   from "@/Pages/Layouts/Components/Modal";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";

// ── Import Helpers 
import { toastStoreSuccess, toastStoreFailed, toastDeleteSuccess, toastDeleteFailed } from "@/Helpers/ToastHelper";

// ── Helper kalkulasi 
const totalNilai    = (m) => parseFloat(((m.tugas*0.3)+(m.uts*0.3)+(m.uas*0.4)).toFixed(2));
const kategoriNilai = (n) => n>=85?"A":n>=70?"B":n>=55?"C":"D";
const gradePoint    = (g) => ({A:4.0,B:3.0,C:2.0,D:1.0}[g]||0);
const hitungIPS     = (m) => gradePoint(kategoriNilai(totalNilai(m)));

const Mahasiswa = ({ mahasiswa, setMahasiswa }) => {

  // state selected mahasiswa: null = tambah, objek = edit
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  // state modal
  const [isModalOpen, setModalOpen] = useState(false);

  // state modal hapus semua
  const [clearModal, setClearModal] = useState(false);

  // ── storeMahasiswa 
  const storeMahasiswa = (data) => {
    try {
      setMahasiswa((prev) => [...prev, data]);
      toastStoreSuccess(data.nama); // ← Toast: tambah berhasil
    } catch {
      toastStoreFailed();           // ← Toast: tambah gagal
    }
  };

  // ── updateMahasiswa 
  const updateMahasiswa = (nim, data) => {
    setMahasiswa((prev) =>
      prev.map((m) => (m.nim === nim ? { ...m, ...data } : m))
    );
  };

  // ── deleteMahasiswa 
  const deleteMahasiswa = (nim) => {
    setMahasiswa((prev) => prev.filter((m) => m.nim !== nim));
  };

  // ── openAddModal 
  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };

  // ── openEditModal 
  const openEditModal = (m) => {
    setSelectedMahasiswa(m);
    setModalOpen(true);
  };

  // ── handleSubmit: tambah atau update berdasarkan selectedMahasiswa 
  const handleSubmit = (formData) => {
    if (selectedMahasiswa) {
      updateMahasiswa(selectedMahasiswa.nim, formData);
    } else {
      storeMahasiswa(formData);
    }
  };

  // ── handleDelete: terima nim, passing ke deleteMahasiswa 
  const handleDelete = (nim, nama) => {
    try {
      deleteMahasiswa(nim);
      toastDeleteSuccess(nama); // ← Toast: hapus berhasil
    } catch {
      toastDeleteFailed();      // ← Toast: hapus gagal
    }
  };

  // ── Sort & Hapus Semua 
  const sortByNIM    = () => setMahasiswa((prev) => [...prev].sort((a, b) => a.nim.localeCompare(b.nim)));
  const sortByStatus = () => setMahasiswa((prev) => [...prev].sort((a, b) => b.status - a.status));
  const clearAll     = () => { setMahasiswa([]); setClearModal(false); };

  // ── Statistik 
  const totalAktif      = mahasiswa.filter((m) => m.status === true).length;
  const totalTidakAktif = mahasiswa.filter((m) => m.status === false).length;
  const rataIPS         = mahasiswa.length
    ? (mahasiswa.reduce((acc, m) => acc + hitungIPS(m), 0) / mahasiswa.length).toFixed(2)
    : "—";

  return (
    <div className="space-y-4">

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total",         val: mahasiswa.length, color: "text-blue-600"   },
          { label: "Aktif",         val: totalAktif,       color: "text-green-600"  },
          { label: "Tidak Aktif",   val: totalTidakAktif,  color: "text-red-500"    },
          { label: "Rata-rata IPS", val: rataIPS,          color: "text-orange-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-xl shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Tabel */}
      <Card className="overflow-hidden p-0">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <Heading as="h2" align="left" color="text-gray-800" spacing="mb-0" className="text-lg">
            Daftar Mahasiswa
          </Heading>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={sortByNIM}>Sort NIM</Button>
            <Button variant="ghost" size="sm" onClick={sortByStatus}>Sort Status</Button>
            <Button variant="ghost" size="sm" onClick={() => setClearModal(true)}>Hapus Semua</Button>
            <Button variant="primary" size="sm" onClick={openAddModal}>+ Tambah Mahasiswa</Button>
          </div>
        </div>

        {/* Komponen Tabel */}
        <MahasiswaTable
          mahasiswa={mahasiswa}
          openEditModal={openEditModal}
          onDelete={handleDelete}
        />
      </Card>

      {/* Modal Hapus Semua */}
      <Modal isOpen={clearModal} onClose={() => setClearModal(false)} title="Hapus Semua Data" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Yakin ingin menghapus <strong>semua {mahasiswa.length} data</strong> mahasiswa?
          </p>
          <p className="text-xs text-red-500">⚠️ Semua data akan hilang dan tidak dapat dikembalikan.</p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setClearModal(false)}>Batal</Button>
            <Button variant="danger" size="sm" onClick={clearAll}>Ya, Hapus Semua</Button>
          </div>
        </div>
      </Modal>

      {/* Komponen Modal */}
      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
        mahasiswa={mahasiswa}
      />

    </div>
  );
};

export default Mahasiswa;
