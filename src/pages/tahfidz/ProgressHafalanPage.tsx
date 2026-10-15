import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/services/store/appStore';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  BookOpen,
  Sparkles,
  Clock,
  AlertCircle,
  ChevronRight,
  X,
  User,
  Star,
  Plus,
  Filter,
  Check
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
import { calculateMemberJuzProgress, JuzDetailProgress } from '@/utils/quranJuz';
import { formatDateTime, formatShortDate } from '@/utils/formatters';
import { MemorizationSubmission } from '@/types';

export const ProgressHafalanPage: React.FC = () => {
  const { progress, memberSubmissions, currentUser } = useAppStore();

  const [selectedJuzModal, setSelectedJuzModal] = useState<JuzDetailProgress | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'diterima' | 'proses'>('all');

  // Hitung progres 30 juz dan statistik hafalan dinamis spesifik untuk santri yang sedang aktif
  const {
    juzDetails,
    verifiedJuzList,
    inProgressJuzList,
    totalVerifiedAyahs,
    totalApprovedSubmissions
  } = useMemo(() => {
    return calculateMemberJuzProgress(memberSubmissions);
  }, [memberSubmissions]);

  const targetJuz = progress?.targetDailyJuz || 5;
  const targetWeekly = progress?.targetWeeklyAyah || 30;

  // Filter riwayat setoran berdasarkan tab
  const filteredSubmissions = useMemo(() => {
    if (historyFilter === 'diterima') {
      return memberSubmissions.filter((s) => s.status === 'diterima');
    }
    if (historyFilter === 'proses') {
      return memberSubmissions.filter((s) => s.status !== 'diterima');
    }
    return memberSubmissions;
  }, [memberSubmissions, historyFilter]);

  // Siapkan data grafik perkembangan bulanan dari riwayat setoran nyata santri
  const chartData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentMonthIdx = new Date().getMonth(); // 0-based
    // Ambil 6 bulan terakhir
    const monthsToShow: { month: string; monthIndex: number; ayat: number; setoran: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonthIdx - i + 12) % 12;
      monthsToShow.push({
        month: monthNames[idx],
        monthIndex: idx,
        ayat: 0,
        setoran: 0
      });
    }

    // Akumulasi setoran yang diterima per bulan
    let cumulativeAyat = 0;
    const acceptedSubs = memberSubmissions
      .filter((s) => s.status === 'diterima')
      .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());

    return monthsToShow.map((m) => {
      // Hitung setoran pada bulan ini
      const subsInMonth = acceptedSubs.filter((s) => {
        const subDate = new Date(s.reviewedAt || s.submittedAt);
        return subDate.getMonth() === m.monthIndex;
      });

      const ayatInMonth = subsInMonth.reduce(
        (acc, curr) => acc + (Math.abs(curr.endAyah - curr.startAyah) + 1),
        0
      );

      cumulativeAyat += ayatInMonth;

      return {
        month: m.month,
        setoran: subsInMonth.length,
        ayat: cumulativeAyat
      };
    });
  }, [memberSubmissions]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'diterima':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Diterima (Mutqin)
          </span>
        );
      case 'sedang_diperiksa':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 text-blue-600" />
            Sedang Diperiksa
          </span>
        );
      case 'perlu_perbaikan':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Perlu Perbaikan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            <Clock className="w-3 h-3 text-slate-500" />
            Menunggu Ujian
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Target & Progres Hafalan
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              Pribadi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Data capaian tahfidz Al-Qur’an riil santri <strong className="text-slate-800">{currentUser?.fullName || 'Santri'}</strong> ({currentUser?.programStudi || 'UNINUS'})
          </p>
        </div>

        <Link
          to="/setor-hafalan"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Setor Hafalan</span>
        </Link>
      </div>

      {/* Summary KPI Cards Dinamis Sesuai Hafalan Anggota */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Disahkan
          </span>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">
            {verifiedJuzList.length} Juz
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {verifiedJuzList.length > 0 ? `Juz: ${verifiedJuzList.join(', ')}` : `Dari target ${targetJuz} Juz`}
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Ayat
          </span>
          <p className="text-2xl font-extrabold text-teal-800 mt-1">
            {totalVerifiedAyahs} Ayat
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Disahkan pembimbing</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Setoran Diterima
          </span>
          <p className="text-2xl font-extrabold text-blue-800 mt-1">
            {totalApprovedSubmissions} Kali
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Dari {memberSubmissions.length} total setoran
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Pencapaian Target
          </span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {Math.min(100, Math.round((verifiedJuzList.length / Math.max(1, targetJuz)) * 100))}%
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Target {targetJuz} Juz</p>
        </div>
      </div>

      {/* Interactive 30 Juz Tracker Map (Disesuaikan dengan hafalan santri) */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">Peta 30 Juz Al-Qur’an</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                Klik Kotak untuk Detail
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Status pencapaian riil hafalan per juz untuk akun Anda
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs bg-slate-50 p-1.5 px-3 rounded-2xl border border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
              <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block shadow-2xs" />
              Selesai ({verifiedJuzList.length})
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
              <span className="w-3 h-3 rounded-md bg-amber-400 inline-block shadow-2xs" />
              Proses ({inProgressJuzList.length})
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
              <span className="w-3 h-3 rounded-md bg-slate-200 inline-block" />
              Belum ({30 - verifiedJuzList.length - inProgressJuzList.length})
            </span>
          </div>
        </div>

        {/* 30 Juz Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 sm:gap-2.5">
          {juzDetails.map((item) => {
            const isCompleted = item.status === 'selesai';
            const isInProgress = item.status === 'proses';

            return (
              <button
                type="button"
                key={item.juz}
                onClick={() => setSelectedJuzModal(item)}
                className={`p-2.5 sm:p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 transform hover:scale-105 border relative group ${
                  isCompleted
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs hover:bg-emerald-700'
                    : isInProgress
                    ? 'bg-amber-100 text-amber-950 border-amber-300 font-bold hover:bg-amber-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                }`}
                title={`Juz ${item.juz}: ${isCompleted ? 'Disahkan' : isInProgress ? 'Dalam Proses' : 'Belum Mulai'}`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider">JUZ</span>
                <span className="text-sm font-black mt-0.5">{item.juz}</span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 mt-1 text-emerald-200 shrink-0" />}
                {isInProgress && <Clock className="w-3.5 h-3.5 mt-1 text-amber-700 shrink-0 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Analytics Chart */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Grafik Perkembangan Hafalan Bulanan
            </h3>
            <p className="text-xs text-slate-500">
              Akumulasi ayat yang telah disahkan pembimbing per bulan
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Tahun 2026
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
                formatter={(value: any) => [`${value} Ayat`, 'Kumulatif Hafalan']}
              />
              <Bar dataKey="ayat" fill="#059669" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Riwayat Setoran Hafalan Pribadi (Disesuaikan dengan hafalan santri) */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Riwayat Setoran Hafalan Pribadi</h3>
            <p className="text-xs text-slate-500">
              Catatan lengkap dan evaluasi nilai bimbingan dari penguji tahfidz
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl shrink-0">
            <button
              onClick={() => setHistoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                historyFilter === 'all'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua ({memberSubmissions.length})
            </button>
            <button
              onClick={() => setHistoryFilter('diterima')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                historyFilter === 'diterima'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Diterima ({totalApprovedSubmissions})
            </button>
            <button
              onClick={() => setHistoryFilter('proses')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                historyFilter === 'proses'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Proses ({memberSubmissions.length - totalApprovedSubmissions})
            </button>
          </div>
        </div>

        {/* List of Submissions */}
        {filteredSubmissions.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-700">Belum Ada Setoran di Kategori Ini</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Silakan lakukan setoran hafalan baru untuk diverifikasi pembimbing
              </p>
            </div>
            <Link
              to="/setor-hafalan"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Mulai Setor Hafalan</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubmissions.map((sub) => {
              const ayahCount = Math.abs(sub.endAyah - sub.startAyah) + 1;
              return (
                <div
                  key={sub.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50/30 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {sub.surahNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900">
                            Surah {sub.surahName}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">
                            {sub.submissionType === 'hafalan_baru' ? 'Hafalan Baru' : 'Murojaah'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Ayat <strong>{sub.startAyah}</strong> s/d <strong>{sub.endAyah}</strong> ({ayahCount} Ayat)
                        </p>
                      </div>
                    </div>

                    <div className="self-end sm:self-center text-right">
                      {renderStatusBadge(sub.status)}
                      <p className="text-[10px] text-slate-400 mt-1">
                        {formatDateTime(sub.submittedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Nilai Evaluasi & Catatan Pembimbing jika sudah dinilai */}
                  {(sub.fluencyScore || sub.tajwidScore || sub.makhrajScore || sub.feedback) && (
                    <div className="pt-2.5 border-t border-slate-200/60 bg-white p-3 rounded-xl space-y-2">
                      {(sub.fluencyScore || sub.tajwidScore || sub.makhrajScore) && (
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                            <span className="text-[10px] text-emerald-800 font-semibold block">Kelancaran</span>
                            <span className="text-xs font-black text-emerald-950">{sub.fluencyScore ?? '-'}</span>
                          </div>
                          <div className="bg-teal-50 p-1.5 rounded-lg border border-teal-100">
                            <span className="text-[10px] text-teal-800 font-semibold block">Tajwid</span>
                            <span className="text-xs font-black text-teal-950">{sub.tajwidScore ?? '-'}</span>
                          </div>
                          <div className="bg-blue-50 p-1.5 rounded-lg border border-blue-100">
                            <span className="text-[10px] text-blue-800 font-semibold block">Makhraj</span>
                            <span className="text-xs font-black text-blue-950">{sub.makhrajScore ?? '-'}</span>
                          </div>
                        </div>
                      )}

                      {sub.feedback && (
                        <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          &ldquo;{sub.feedback}&rdquo;
                          <span className="block text-[10px] font-bold text-slate-400 not-italic mt-1">
                            — Penguji: {sub.mentorName || 'Pembimbing Tahfidz'}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Modal Detail Juz saat Kotak Juz Diklik */}
      {selectedJuzModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Detail Capaian Juz
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  Juz {selectedJuzModal.juz}
                </h3>
                <p className="text-xs text-slate-500">{selectedJuzModal.boundary.name}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJuzModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status card */}
            <div className={`p-4 rounded-2xl border ${
              selectedJuzModal.status === 'selesai'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : selectedJuzModal.status === 'proses'
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                    Status Hafalan Anda:
                  </span>
                  <span className="text-sm font-extrabold">
                    {selectedJuzModal.status === 'selesai'
                      ? 'Telah Disahkan oleh Pembimbing'
                      : selectedJuzModal.status === 'proses'
                      ? 'Sedang Dalam Proses Evaluasi'
                      : 'Belum Ada Setoran'}
                  </span>
                </div>
                {selectedJuzModal.status === 'selesai' && (
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-600 text-white rounded-xl shadow-2xs">
                    {selectedJuzModal.verifiedAyahsCount} Ayat Mutqin
                  </span>
                )}
              </div>
            </div>

            {/* Submissions list in this Juz */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-slate-900">
                Riwayat Setoran Anda di Juz {selectedJuzModal.juz} ({selectedJuzModal.submissions.length})
              </h4>

              {selectedJuzModal.submissions.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-2 text-xs text-slate-500">
                  <p>Belum ada riwayat setoran ayat untuk Juz {selectedJuzModal.juz}.</p>
                  <p className="text-[11px] text-slate-400">
                    Anda dapat menyetorkan hafalan surah yang ada di juz ini kapan saja.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedJuzModal.submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          Surah {sub.surahName} : Ayat {sub.startAyah} - {sub.endAyah}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {formatShortDate(sub.submittedAt)} • Penguji: {sub.mentorName || 'Admin'}
                        </p>
                      </div>
                      <div className="text-right">
                        {renderStatusBadge(sub.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Link
                to={`/setor-hafalan?surah=${selectedJuzModal.boundary.startSurah}`}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition shadow-md"
              >
                + Setor Hafalan untuk Juz {selectedJuzModal.juz}
              </Link>
              <button
                type="button"
                onClick={() => setSelectedJuzModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
