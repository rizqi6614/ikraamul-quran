import React, { useState } from 'react';
import { useAppStore } from '@/services/store/appStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  Award,
  HeartHandshake,
  QrCode,
  TrendingUp,
  Download,
  Calendar,
  DollarSign
} from 'lucide-react';
import { formatRupiah } from '@/utils/formatters';

export const AdminReportsPage: React.FC = () => {
  const { submissions, donationPrograms, disbursements, attendanceRecords } = useAppStore();
  const [activeTab, setActiveTab] = useState<'hafalan' | 'keuangan' | 'absensi'>('hafalan');

  // Chart data matching reference poster screenshot (Progress Hafalan 2, 4, 6, 8, 10, 12)
  const hafalanChartData = [
    { target: '2', juz: 3 },
    { target: '4', juz: 5 },
    { target: '6', juz: 7 },
    { target: '8', juz: 9 },
    { target: '10', juz: 11 },
    { target: '12', juz: 13 }
  ];

  const financialChartData = [
    { bulan: 'Mei', masuk: 1200000, keluar: 800000 },
    { bulan: 'Jun', masuk: 2100000, keluar: 1500000 },
    { bulan: 'Jul', masuk: 3400000, keluar: 2200000 },
    { bulan: 'Agt', masuk: 4100000, keluar: 2900000 },
    { bulan: 'Sep', masuk: 4800000, keluar: 3500000 },
    { bulan: 'Okt', masuk: 5250000, keluar: 4000000 }
  ];

  const attendancePieData = [
    { name: 'Hadir', value: 85, color: '#059669' },
    { name: 'Izin', value: 8, color: '#3b82f6' },
    { name: 'Sakit', value: 4, color: '#f59e0b' },
    { name: 'Alpa', value: 3, color: '#ef4444' }
  ];

  const totalCollected = donationPrograms.reduce((acc, p) => acc + p.collectedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Laporan & Statistik Organisasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Analitik perkembangan capaian tahfidz, arus kas infaq, dan rekapitulasi presensi
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
          <BarChart3 className="w-5 h-5" />
        </div>
      </div>

      {/* Tabs (Matching exact reference screenshot: Hafalan, Keuangan, Absensi) */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-sm">
        <button
          onClick={() => setActiveTab('hafalan')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'hafalan'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Hafalan
        </button>
        <button
          onClick={() => setActiveTab('keuangan')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'keuangan'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Keuangan
        </button>
        <button
          onClick={() => setActiveTab('absensi')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'absensi'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Absensi
        </button>
      </div>

      {/* Metric Cards (Matching screenshot: Total Setoran 45 Juz & Infaq Rp 5.250.000) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Setoran Card matching screenshot */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Setoran
            </span>
            <p className="text-3xl font-extrabold text-emerald-800">45 Juz</p>
            <p className="text-xs text-slate-500">Kumulatif seluruh anggota aktif UNINUS</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
        </div>

        {/* Infaq & Shadaqah Card matching screenshot */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Infaq & Shadaqah
            </span>
            <p className="text-3xl font-extrabold text-teal-800">
              {formatRupiah(totalCollected)}
            </p>
            <p className="text-xs text-slate-500">Total penerimaan terverifikasi</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <HeartHandshake className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Tab 1: Hafalan Report & Chart */}
      {activeTab === 'hafalan' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Progress Hafalan (Juz)</h3>
              <p className="text-xs text-slate-500">
                Distribusi capaian hafalan santri terhadap target tahfidz
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              Recharts Analytic
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hafalanChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="target" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} Juz`, 'Rata-rata Capaian']}
                />
                <Bar dataKey="juz" fill="#059669" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 2: Keuangan Report & Chart */}
      {activeTab === 'keuangan' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Arus Kas Infaq & Penyaluran</h3>
              <p className="text-xs text-slate-500">Grafik perbandingan penerimaan dan pengeluaran</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              Cashflow 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [formatRupiah(val), '']}
                />
                <Area type="monotone" dataKey="masuk" stroke="#059669" fillOpacity={1} fill="url(#colorMasuk)" name="Penerimaan" />
                <Area type="monotone" dataKey="keluar" stroke="#ef4444" fillOpacity={1} fill="url(#colorKeluar)" name="Penyaluran" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 3: Absensi Report & Pie */}
      {activeTab === 'absensi' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Tingkat Kehadiran Anggota</h3>
              <p className="text-xs text-slate-500">Persentase kehadiran pada kegiatan wajib organisasi</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              Rate 85% Hadir
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendancePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {attendancePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
