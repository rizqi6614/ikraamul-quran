import React from 'react';
import { useAppStore } from '@/services/store/appStore';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  BookOpen,
  Sparkles,
  BarChart2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const ProgressHafalanPage: React.FC = () => {
  const { progress, memberSubmissions, currentUser } = useAppStore();

  const totalJuz = progress?.totalJuzMemorized || 2;
  const targetJuz = progress?.targetDailyJuz || 5;
  const totalAyah = progress?.totalAyahMemorized || 185;

  // Monthly memorization progress chart data
  const chartData = [
    { month: 'Mei', setoran: 15, ayat: 85 },
    { month: 'Jun', setoran: 22, ayat: 130 },
    { month: 'Jul', setoran: 28, ayat: 165 },
    { month: 'Agt', setoran: 35, ayat: 190 },
    { month: 'Sep', setoran: 40, ayat: 220 },
    { month: 'Okt', setoran: 45, ayat: 255 }
  ];

  // 30 Juz interactive tracker grid
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Target & Progres Hafalan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencapaian tahfidz Al-Qur’an terverifikasi oleh penguji dan pembimbing
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Disahkan
          </span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">{totalJuz} Juz</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Dari target {targetJuz} Juz</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Ayat
          </span>
          <p className="text-2xl font-extrabold text-teal-800 mt-1">{totalAyah} Ayat</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Terverifikasi lancar</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Setoran Diterima
          </span>
          <p className="text-2xl font-extrabold text-blue-800 mt-1">
            {memberSubmissions.filter((s) => s.status === 'diterima').length} Kali
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Oleh Pembimbing</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Pencapaian Target
          </span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {Math.round((totalJuz / targetJuz) * 100)}%
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Target Semester Ini</p>
        </div>
      </div>

      {/* Recharts Analytics Chart */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Grafik Perkembangan Hafalan Bulanan
            </h3>
            <p className="text-xs text-slate-500">Jumlah kumulatif ayat yang berhasil disetorkan</p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
            2026 Aktif
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                formatter={(value: any) => [`${value} Ayat`, 'Kumulatif']}
              />
              <Bar dataKey="ayat" fill="#059669" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive 30 Juz Tracker Map */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Peta 30 Juz Al-Qur’an</h3>
            <p className="text-xs text-slate-500">Status pencapaian hafalan per juz</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" /> Selesai
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-emerald-200 inline-block" /> Proses
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-slate-100 inline-block" /> Belum
            </span>
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2.5">
          {juzList.map((juz) => {
            const isCompleted = juz <= totalJuz;
            const isInProgress = juz === totalJuz + 1;

            return (
              <div
                key={juz}
                onClick={() =>
                  alert(`Juz ${juz}: ${isCompleted ? 'Telah disahkan oleh pembimbing' : isInProgress ? 'Sedang dalam proses hafalan & setoran' : 'Belum dimulai'}`)
                }
                className={`p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 border ${
                  isCompleted
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : isInProgress
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">JUZ</span>
                <span className="text-sm font-extrabold mt-0.5">{juz}</span>
                {isCompleted && <CheckCircle2 className="w-3 h-3 mt-1 text-emerald-200" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
