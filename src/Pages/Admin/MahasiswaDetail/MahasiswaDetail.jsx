import { useParams, Link } from "react-router-dom";
import Card from "@/Pages/Layouts/Components/Card";

const totalNilai    = m => parseFloat(((m.tugas*0.3)+(m.uts*0.3)+(m.uas*0.4)).toFixed(2));
const kategoriNilai = n => n>=85?"A":n>=70?"B":n>=55?"C":"D";
const gradePoint    = g => ({A:4.0,B:3.0,C:2.0,D:1.0}[g]||0);

// Menerima mahasiswa dari main.jsx agar data selalu sinkron
const MahasiswaDetail = ({ mahasiswa = [] }) => {
  const { nim } = useParams();
  const data = mahasiswa.find(m => m.nim === nim);

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold mb-4">Data mahasiswa tidak ditemukan.</p>
        <Link to="/admin/mahasiswa" className="text-blue-600 hover:underline text-sm">
          ← Kembali ke Daftar Mahasiswa
        </Link>
      </div>
    );
  }

  const total = totalNilai(data);
  const grade = kategoriNilai(total);
  const ips   = gradePoint(grade);
  const gradeBadge = { A:"bg-green-100 text-green-700", B:"bg-blue-100 text-blue-700", C:"bg-yellow-100 text-yellow-700", D:"bg-red-100 text-red-600" };

  return (
    <div className="max-w-lg">
      <div className="mb-4">
        <Link to="/admin/mahasiswa" className="text-blue-600 hover:underline text-sm">
          ← Kembali ke Daftar Mahasiswa
        </Link>
      </div>

      <Card>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Detail Mahasiswa</h2>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            {[
              { label: "NIM",         value: data.nim },
              { label: "Nama",        value: data.nama },
              { label: "Tugas",       value: data.tugas },
              { label: "UTS",         value: data.uts },
              { label: "UAS",         value: data.uas },
              { label: "Total Nilai", value: total.toFixed(1) },
            ].map(row => (
              <tr key={row.label}>
                <td className="py-2 pr-4 font-medium text-gray-500 w-36">{row.label}</td>
                <td className="py-2 text-gray-800">{row.value}</td>
              </tr>
            ))}
            <tr>
              <td className="py-2 pr-4 font-medium text-gray-500">Grade</td>
              <td className="py-2">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${gradeBadge[grade]}`}>{grade}</span>
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-gray-500">IPS</td>
              <td className="py-2 text-gray-800">{ips.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 font-medium text-gray-500">Status</td>
              <td className="py-2">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${data.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {data.status ? "Aktif" : "Tidak Aktif"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default MahasiswaDetail;
