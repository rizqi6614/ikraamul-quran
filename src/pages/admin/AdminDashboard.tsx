import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/services/store/appStore';
import {
  Users,
  Award,
  Calendar,
  QrCode,
  HeartHandshake,
  BarChart3,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { formatRupiah, formatShortDate } from '@/utils/formatters';

export const AdminDashboard: React.FC = () => {
  const {
    allUsers,
    submissions,
    activities,
    donations,
    donationPrograms,
    disbursements,
    attendanceRecords
  } = useAppStore();

  const totalMembers = allUsers.filter((u) => u.role === 'member').length;
  const pendingMembers = allUsers.filter((u) => u.membershipStatus === 'pending').length;
  const pendingSubmissions = submissions.filter((s) => s.status === 'menunggu').length;
  const totalVerifiedInfaq = donationPrograms.reduce((acc, p) => acc + p.collectedAmount, 0);
  const totalDisbursed = disbursements.reduce((acc, d) => acc + d.amount, 0);

  interface AdminCardItem {
    title: string;
    desc: string;
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    color: string;
  }

  const adminMenuCards: AdminCardItem[] = [
    {
      title: 'Kelola Anggota',
      desc: 'Tambah / Ubah / Hapus & Persetujuan',
      to: '/admin/anggota',
      icon: Users,
      badge: pendingMembers > 0 ? `${pendingMembers} Menunggu` : undefined,
      color: 'bg-emerald-600'
    },
    {
      title: 'Kelola Kegiatan',
      desc: 'Jadwal, Lokasi, dan Kuota',
      to: '/admin/kegiatan',
      icon: Calendar,
      color: 'bg-blue-600'
    },
    {
      title: 'Kelola Setoran',
      desc: 'Verifikasi & Penilaian Tahfidz',
      to: '/admin/setoran',
      icon: Award,
      badge: pendingSubmissions > 0 ? `${pendingSubmissions} Baru` : undefined,
      color: 'bg-teal-600'
    },
    {
      title: 'Sesi Absensi & QR',
      desc: 'Buka Sesi QR & Rekap Kehadiran',
      to: '/admin/absensi',
      icon: QrCode,
      color: 'bg-indigo-600'
    },
    {
      title: 'Infaq & Shadaqah',
      desc: 'Verifikasi Bukti & Penyaluran',
      to: '/admin/infaq',
      icon: HeartHandshake,
      color: 'bg-rose-600'
    },
    {
      title: 'Laporan & Statistik',
      desc: 'Hafalan, Keuangan, Absensi',
      to: '/admin/laporan',
      icon: BarChart3,
      color: 'bg-purple-600'
    },
    {
      title: 'Informasi & Pengumuman',
      desc: 'Broadcast Berita Organisasi',
      to: '/admin/pengumuman',
      icon: Megaphone,
      color: 'bg-amber-600'
    },
    {
      title: 'Pengaturan Aplikasi',
      desc: 'Koneksi Firebase & Sistem',
      to: '/admin/pengaturan',
      icon: Settings,
      color: 'bg-slate-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sistem Manajemen Ikraamul Qur’an UNINUS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dashboard Administrator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Pusat monitoring bimbingan tahfidz, verifikasi hafalan, pengelolaan infaq, absensi kegiatan, dan keanggotaan mahasiswa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/setoran"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs shadow-md transition flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Periksa Setoran ({pendingSubmissions})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-100 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Anggota Aktif</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalMembers}</p>
          <p className="text-[10px] text-amber-600 font-semibold">
            {pendingMembers} Akun menunggu persetujuan
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-100 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Setoran</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{submissions.length}</p>
          <p className="text-[10px] text-emerald-600 font-semibold">
            {submissions.filter((s) => s.status === 'diterima').length} Diterima
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-100 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Infaq Terkumpul</span>
            <HeartHandshake className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-800">
            {formatRupiah(totalVerifiedInfaq)}
          </p>
          <p className="text-[10px] text-slate-400 font-semibold">
            Tersalurkan: {formatRupiah(totalDisbursed)}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-100 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Kegiatan Aktif</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {activities.filter((a) => a.status === 'akan_datang').length}
          </p>
          <p className="text-[10px] text-slate-400 font-semibold">
            Total Absensi: {attendanceRecords.length}
          </p>
        </div>
      </div>

      {/* Admin Menu Grid (Matching screenshot: Kelola Anggota, Kelola Kegiatan, Kelola Setoran, Laporan & Statistik, Pengaturan Aplikasi) */}
      <div>
        <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-3">
          Menu Pengelolaan (Admin Panel)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {adminMenuCards.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.to}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`w-11 h-11 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
                <div className="pt-4 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition">
                  <span>Buka Kelola</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Setoran Menunggu Review Preview Table */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Pengajuan Setoran Menunggu Pemeriksaan ({pendingSubmissions})
            </h3>
            <p className="text-xs text-slate-500">
              Perlu evaluasi kelancaran, tajwid, dan makharijul huruf
            </p>
          </div>
          <Link
            to="/admin/setoran"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            Lihat Semua Setoran &rarr;
          </Link>
        </div>

        {pendingSubmissions === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
            <p className="text-xs font-semibold">Semua pengajuan setoran telah diperiksa!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {submissions
              .filter((s) => s.status === 'menunggu')
              .map((sub) => (
                <div key={sub.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      {sub.memberName} ({sub.memberNim})
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Surah {sub.surahName} (Ayat {sub.startAyah} - {sub.endAyah}) • {sub.submissionType.replace('_', ' ')}
                    </p>
                  </div>
                  <Link
                    to="/admin/setoran"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
                  >
                    Beri Nilai & Review
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
