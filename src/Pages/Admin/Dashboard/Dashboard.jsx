import React from 'react';
import { useMahasiswa } from '@/Utils/apiHooks';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';

const Dashboard = () => {
  const { data: mhsList = [], isLoading, isError } = useMahasiswa();

  // --- LOGIKA PERHITUNGAN NILAI ---
  const calculateGrades = (tugas, uts, uas) => {
    const na = (Number(tugas) * 0.3) + (Number(uts) * 0.3) + (Number(uas) * 0.4);
    let grade = 'E', ips = 0.00, color = 'bg-red-100 text-red-700';
    if (na >= 85) { grade = 'A'; ips = 4.00; color = 'bg-green-100 text-green-700'; }
    else if (na >= 70) { grade = 'B'; ips = 3.00; color = 'bg-blue-100 text-blue-700'; }
    else if (na >= 55) { grade = 'C'; ips = 2.00; color = 'bg-yellow-100 text-yellow-700'; }
    else if (na >= 40) { grade = 'D'; ips = 1.00; color = 'bg-orange-100 text-orange-700'; }
    return { na: na.toFixed(1), grade, ips: ips.toFixed(2), color };
  };

  const totalMhs = mhsList.length;
  const mhsAktif = mhsList.filter(m => m.status === true).length;
  const mhsTidakAktif = mhsList.filter(m => m.status === false).length;
  const avgIPS = totalMhs > 0 
    ? (mhsList.reduce((acc, curr) => acc + Number(calculateGrades(curr.tugas, curr.uts, curr.uas).ips), 0) / totalMhs).toFixed(2)
    : "0.00";

  // --- PERSIAPAN DATA UNTUK 3 CHART ---
  const pieData = [
    { name: 'Aktif', value: mhsAktif },
    { name: 'Tidak Aktif', value: mhsTidakAktif }
  ];
  const PIE_COLORS = ['#22c55e', '#ef4444']; 

  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  mhsList.forEach(m => {
    const { grade } = calculateGrades(m.tugas, m.uts, m.uas);
    if (gradeCounts[grade] !== undefined) gradeCounts[grade]++;
  });
  const barData = Object.keys(gradeCounts).map(key => ({
    name: `Grade ${key}`,
    Total: gradeCounts[key]
  }));

  const lineData = mhsList.slice(0, 5).map(m => ({
    name: m.nama.split(' ')[0], 
    Tugas: Number(m.tugas),
    UTS: Number(m.uts),
    UAS: Number(m.uas)
  }));

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, Admin!</h1>
        <p className="text-gray-500">Ringkasan data dan analitik mahasiswa.</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-blue-600">{isLoading ? "..." : totalMhs}</h2>
          <p className="text-gray-500 text-sm mt-1">Total Mahasiswa</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-green-500">{isLoading ? "..." : mhsAktif}</h2>
          <p className="text-gray-500 text-sm mt-1">Aktif</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-red-500">{isLoading ? "..." : mhsTidakAktif}</h2>
          <p className="text-gray-500 text-sm mt-1">Tidak Aktif</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-orange-500">{isLoading ? "..." : avgIPS}</h2>
          <p className="text-gray-500 text-sm mt-1">Rata-rata IPS</p>
        </div>
      </div>

      {/* SECTION CHARTS (3 GRAFIK UKURAN PADAT) */}
      {!isLoading && !isError && totalMhs > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CHART 1: Pie Chart Status */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Status Mahasiswa</h2>
            <div className="h-52"> 
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 2: Bar Chart Distribusi Grade */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Distribusi Grade Mahasiswa</h2>
            <div className="h-52"> 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 3: Line Chart Perbandingan Nilai */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 col-span-1 lg:col-span-3">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Tren Nilai (5 Mahasiswa Terbaru)</h2>
            <div className="h-60"> 
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                  <RechartsTooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="Tugas" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="UTS" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="UAS" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* TABEL DATA MAHASISWA */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Data Mahasiswa Terkini</h2>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Memuat data...</div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">Gagal memuat data.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">NIM</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nama</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Nilai Akhir</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Grade</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mhsList.length > 0 ? (
                  mhsList.slice(0, 5).map((m) => { 
                    const result = calculateGrades(m.tugas, m.uts, m.uas);
                    return (
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600">{m.nim}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{m.nama}</td>
                        <td className="px-6 py-4 text-sm text-center font-bold text-gray-800">{result.na}</td>
                        <td className="px-6 py-4 text-sm text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${result.color}`}>{result.grade}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${m.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {m.status ? 'Aktif' : 'Tidak Aktif'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">Belum ada data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;