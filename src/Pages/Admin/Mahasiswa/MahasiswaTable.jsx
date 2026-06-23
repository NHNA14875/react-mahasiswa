import { Link } from "react-router-dom";
import Button from "@/Pages/Layouts/Components/Button";

// ── Import Swal Helper 
import { confirmDelete } from "@/Helpers/SwalHelper";

// ── Helper kalkulasi 
const totalNilai    = (m) => parseFloat(((m.tugas*0.3)+(m.uts*0.3)+(m.uas*0.4)).toFixed(2));
const kategoriNilai = (n) => n>=85?"A":n>=70?"B":n>=55?"C":"D";
const gradePoint    = (g) => ({A:4.0,B:3.0,C:2.0,D:1.0}[g]||0);
const hitungIPS     = (m) => gradePoint(kategoriNilai(totalNilai(m)));

const gradeBadge = {
  A: "bg-green-100 text-green-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-red-100 text-red-600",
};

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete }) => {

  // ── handleDelete: konfirmasi Swal2 lalu panggil onDelete dengan nim 
  const handleDelete = async (m) => {
    const confirmed = await confirmDelete(m.nama, m.nim); // ← Swal: konfirmasi hapus
    if (!confirmed) return;
    onDelete(m.nim, m.nama); // panggil onDelete dengan parameter nim mahasiswa
  };

  // ── Render 
  return (
    <div className="overflow-x-auto px-5 pb-5 pt-3">
      {mahasiswa.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">
          Belum ada data. Klik <strong>+ Tambah Mahasiswa</strong>.
        </div>
      ) : (
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              {["No","NIM","Nama","Tugas","UTS","UAS","Nilai Akhir","Grade","IPS","Status","Aksi"].map((h) => (
                <th key={h} className="py-2 px-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* map baris-baris mahasiswa dari props */}
            {mahasiswa.map((m, i) => {
              const nf    = totalNilai(m);
              const grade = kategoriNilai(nf);
              const ips   = hitungIPS(m);
              return (
                <tr
                  key={m.nim}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition ${i % 2 === 1 ? "bg-gray-50/60" : ""}`}
                >
                  <td className="py-2 px-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="py-2 px-3 font-mono text-xs text-gray-500">{m.nim}</td>
                  <td className="py-2 px-3 font-medium">{m.nama}</td>
                  <td className="py-2 px-3 text-center">{m.tugas}</td>
                  <td className="py-2 px-3 text-center">{m.uts}</td>
                  <td className="py-2 px-3 text-center">{m.uas}</td>
                  <td className="py-2 px-3 text-center font-semibold">{nf.toFixed(1)}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${gradeBadge[grade]}`}>
                      {grade}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">{ips.toFixed(2)}</td>
                  <td className="py-2 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${m.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {m.status ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex gap-1.5 items-center">
                      <Link
                        to={`/admin/mahasiswa/${m.nim}`}
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition"
                      >
                        Detail
                      </Link>
                      {/* Edit: panggil openEditModal dengan objek mahasiswa */}
                      <Button size="sm" variant="warning" onClick={() => openEditModal(m)}>
                        Edit
                      </Button>
                      {/* Hapus: konfirmasi Swal2 lalu panggil onDelete */}
                      <Button size="sm" variant="danger" onClick={() => handleDelete(m)}>
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MahasiswaTable;
