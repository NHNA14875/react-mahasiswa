import Card from "@/Pages/Layouts/Components/Card";

const totalNilai    = m => parseFloat(((m.tugas*0.3)+(m.uts*0.3)+(m.uas*0.4)).toFixed(2));
const kategoriNilai = n => n>=85?"A":n>=70?"B":n>=55?"C":"D";
const gradePoint    = g => ({A:4.0,B:3.0,C:2.0,D:1.0}[g]||0);
const IPS           = m => gradePoint(kategoriNilai(totalNilai(m)));

const StatCard = ({ label, value, color }) => (
  <Card className="border border-gray-200 shadow-none">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
  </Card>
);

// Menerima mahasiswa dari main.jsx agar data selalu sinkron
const Dashboard = ({ mahasiswa = [] }) => {
  const aktif      = mahasiswa.filter(m => m.status === true).length;
  const tidakAktif = mahasiswa.filter(m => m.status === false).length;
  const avgIPS     = mahasiswa.length
    ? (mahasiswa.reduce((a, m) => a + IPS(m), 0) / mahasiswa.length).toFixed(2)
    : "—";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Selamat Datang, Admin!</h2>
        <p className="text-sm text-gray-500 mt-0.5">Ringkasan data mahasiswa.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Mahasiswa" value={mahasiswa.length} color="text-blue-600" />
        <StatCard label="Aktif"           value={aktif}            color="text-green-600" />
        <StatCard label="Tidak Aktif"     value={tidakAktif}       color="text-red-500" />
        <StatCard label="Rata-rata IPS"   value={avgIPS}           color="text-orange-500" />
      </div>

      <Card className="border border-gray-200 shadow-none overflow-hidden p-0">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Data Mahasiswa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                {["NIM","Nama","Nilai Akhir","Grade","Status"].map(h => (
                  <th key={h} className="py-2.5 px-5 text-left font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mahasiswa.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">Belum ada data.</td>
                </tr>
              ) : mahasiswa.map((m, i) => {
                const nf = totalNilai(m);
                const g  = kategoriNilai(nf);
                const gc = {A:"text-green-700 bg-green-100",B:"text-blue-700 bg-blue-100",C:"text-yellow-700 bg-yellow-100",D:"text-red-700 bg-red-100"}[g];
                return (
                  <tr key={m.nim} className={`border-b border-gray-100 hover:bg-gray-50 ${i%2===1?"bg-gray-50/50":""}`}>
                    <td className="py-2.5 px-5 font-mono text-xs text-gray-500">{m.nim}</td>
                    <td className="py-2.5 px-5 font-medium text-gray-800">{m.nama}</td>
                    <td className="py-2.5 px-5 font-semibold">{nf.toFixed(1)}</td>
                    <td className="py-2.5 px-5">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${gc}`}>{g}</span>
                    </td>
                    <td className="py-2.5 px-5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${m.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {m.status ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
