import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/services/store/appStore';
import {
  Award,
  BookOpen,
  Calendar,
  Mic,
  Sparkles,
  HeartHandshake,
  QrCode,
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  ArrowUpRight,
  ShieldAlert,
  Play,
  MapPin
} from 'lucide-react';
import { formatRupiah, formatShortDate, getHijriDate } from '@/utils/formatters';

interface PrayerTimes {
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  tanggal?: string;
}

const defaultPrayerTimes: PrayerTimes = {
  imsak: '04:03',
  subuh: '04:13',
  terbit: '05:21',
  dhuha: '05:53',
  dzuhur: '11:39',
  ashar: '14:42',
  maghrib: '17:50',
  isya: '18:56'
};

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    memberSubmissions,
    progress,
    activities,
    announcements,
    donations,
    memberAttendanceRecords,
    donationPrograms
  } = useAppStore();

  const navigate = useNavigate();

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(defaultPrayerTimes);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        const cacheKey = `prayer_times_1219_${y}_${m}_${d}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setPrayerTimes(JSON.parse(cached));
          return;
        }
        const res = await fetch(`https://api.myquran.com/v2/sholat/jadwal/1219/${y}/${m}/${d}`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.jadwal) {
            setPrayerTimes(json.data.jadwal);
            localStorage.setItem(cacheKey, JSON.stringify(json.data.jadwal));
          }
        }
      } catch (e) {
        console.warn('Failed to fetch prayer times, using default', e);
      }
    };
    fetchPrayerTimes();
  }, []);

  // Compute upcoming prayer
  const getCurrentPrayer = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const toMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const prayers = [
      { name: 'Subuh', time: prayerTimes.subuh },
      { name: 'Dzuhur', time: prayerTimes.dzuhur },
      { name: 'Ashar', time: prayerTimes.ashar },
      { name: 'Maghrib', time: prayerTimes.maghrib },
      { name: 'Isya', time: prayerTimes.isya }
    ];

    for (const p of prayers) {
      if (currentMinutes < toMinutes(p.time)) {
        return p;
      }
    }
    return { name: 'Subuh', time: prayerTimes.subuh };
  };

  const activeUpcoming = getCurrentPrayer();

  const quickMenus = [
    {
      title: 'Setor Hafalan',
      icon: Award,
      to: '/setor-hafalan',
      color: 'bg-emerald-500 text-white',
      desc: 'Tahfidz'
    },
    {
      title: 'Al-Qur’an',
      icon: BookOpen,
      to: '/quran',
      color: 'bg-teal-500 text-white',
      desc: 'Digital 114 Surah'
    },
    {
      title: 'Jadwal',
      icon: Calendar,
      to: '/kegiatan',
      color: 'bg-blue-500 text-white',
      desc: 'Kegiatan UNINUS'
    },
    {
      title: 'Talaqqi & Murojaah',
      icon: Mic,
      to: '/talaqqi',
      color: 'bg-purple-500 text-white',
      desc: 'Bimbingan & Audio'
    },
    {
      title: 'Doa & Dzikir',
      icon: Sparkles,
      to: '/doa-dzikir',
      color: 'bg-amber-500 text-white',
      desc: 'Harian Ma\'tsurat'
    },
    {
      title: 'Infaq & Shadaqah',
      icon: HeartHandshake,
      to: '/infaq',
      color: 'bg-rose-500 text-white',
      desc: 'Amal Jariyah'
    },
    {
      title: 'Absensi',
      icon: QrCode,
      to: '/absensi',
      color: 'bg-indigo-500 text-white',
      desc: 'Scan QR Sesi'
    },
    {
      title: 'Progres',
      icon: TrendingUp,
      to: '/progres-hafalan',
      color: 'bg-cyan-500 text-white',
      desc: 'Pencapaian Juz'
    }
  ];

  // Calculate total donations verified
  const totalVerifiedInfaq = donationPrograms.reduce((acc, curr) => acc + curr.collectedAmount, 0);

  // Status submission badge helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'diterima':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Diterima
          </span>
        );
      case 'sedang_diperiksa':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 text-blue-600" />
            Diperiksa
          </span>
        );
      case 'perlu_perbaikan':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Perbaikan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            <Clock className="w-3 h-3 text-slate-500" />
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-emerald-100/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
              alt={currentUser?.fullName}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Assalamu’alaikum Warahmatullahi Wabarakatuh
            </p>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {currentUser?.fullName || 'Sahabat Al-Qur’an'}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>{currentUser?.programStudi}</span>
              <span>•</span>
              <span className="font-medium text-emerald-800">{getHijriDate()}</span>
            </p>
          </div>
        </div>

        {/* Quick Setor Hafalan CTA */}
        <div className="flex items-center gap-2">
          <Link
            to="/setor-hafalan"
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-2xl text-xs shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4 text-emerald-200" />
            <span>Mulai Setor Hafalan</span>
          </Link>
          <Link
            to="/absensi"
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold rounded-2xl text-xs transition flex items-center gap-1.5"
            title="Scan QR Absensi"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Absen</span>
          </Link>
        </div>
      </div>

      {/* Jadwal Sholat Kecil Berdasarkan NU Online / Kemenag RI */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-emerald-100/90 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">Jadwal Sholat Hari Ini</h3>
                <span className="text-[9px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full uppercase">
                  NU Online
                </span>
              </div>
              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span>Kota Bandung (UNINUS)</span>
              </p>
            </div>
          </div>
          <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/80">
            Sholat Berikutnya: <strong className="font-bold text-emerald-950">{activeUpcoming.name} ({activeUpcoming.time})</strong>
          </div>
        </div>

        {/* Mini Grid Times */}
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 text-center">
          <div className="hidden sm:block p-2 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] text-slate-500 font-medium">Imsak</p>
            <p className="text-xs font-bold text-slate-700 mt-0.5">{prayerTimes.imsak}</p>
          </div>
          <div className={`p-2 rounded-xl transition ${activeUpcoming.name === 'Subuh' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-50 border border-slate-100 text-slate-700'}`}>
            <p className={`text-[10px] ${activeUpcoming.name === 'Subuh' ? 'text-emerald-100' : 'text-slate-500'} font-medium`}>Subuh</p>
            <p className="text-xs font-bold mt-0.5">{prayerTimes.subuh}</p>
          </div>
          <div className={`p-2 rounded-xl transition ${activeUpcoming.name === 'Dzuhur' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-50 border border-slate-100 text-slate-700'}`}>
            <p className={`text-[10px] ${activeUpcoming.name === 'Dzuhur' ? 'text-emerald-100' : 'text-slate-500'} font-medium`}>Dzuhur</p>
            <p className="text-xs font-bold mt-0.5">{prayerTimes.dzuhur}</p>
          </div>
          <div className={`p-2 rounded-xl transition ${activeUpcoming.name === 'Ashar' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-50 border border-slate-100 text-slate-700'}`}>
            <p className={`text-[10px] ${activeUpcoming.name === 'Ashar' ? 'text-emerald-100' : 'text-slate-500'} font-medium`}>Ashar</p>
            <p className="text-xs font-bold mt-0.5">{prayerTimes.ashar}</p>
          </div>
          <div className={`p-2 rounded-xl transition ${activeUpcoming.name === 'Maghrib' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-50 border border-slate-100 text-slate-700'}`}>
            <p className={`text-[10px] ${activeUpcoming.name === 'Maghrib' ? 'text-emerald-100' : 'text-slate-500'} font-medium`}>Maghrib</p>
            <p className="text-xs font-bold mt-0.5">{prayerTimes.maghrib}</p>
          </div>
          <div className={`p-2 rounded-xl transition ${activeUpcoming.name === 'Isya' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'bg-slate-50 border border-slate-100 text-slate-700'}`}>
            <p className={`text-[10px] ${activeUpcoming.name === 'Isya' ? 'text-emerald-100' : 'text-slate-500'} font-medium`}>Isya</p>
            <p className="text-xs font-bold mt-0.5">{prayerTimes.isya}</p>
          </div>
        </div>
      </div>

      {/* Target Hafalan Hari Ini Card (Matching exact screenshot: 2/5 Juz) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white shadow-xl">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Target Hafalan Hari Ini</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {progress?.totalJuzMemorized ?? 0} / {progress?.targetDailyJuz ?? 5} Juz
              </span>
              <span className="text-xs text-emerald-200 font-medium">Telah Terverifikasi</span>
            </div>
            <p className="text-xs text-emerald-100/90 max-w-md leading-relaxed">
              Total hafalan yang telah disahkan pembimbing: <strong className="text-white font-bold">{progress?.totalAyahMemorized ?? 0} Ayat</strong>. Istiqomah menjaga hafalan adalah kunci kemuliaan ahlul Qur’an.
            </p>
          </div>

          {/* Progress bar and metrics */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-56 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-100 font-medium">Pencapaian Target</span>
              <span className="font-extrabold text-amber-300">
                {Math.round(((progress?.totalJuzMemorized || 0) / (progress?.targetDailyJuz || 5)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-emerald-950/60 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-300 h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(((progress?.totalJuzMemorized || 0) / (progress?.targetDailyJuz || 5)) * 100)
                  )}%`
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-emerald-200 pt-1">
              <span>Target Mingguan: {progress?.targetWeeklyAyah || 20} Ayat</span>
              <Link to="/progres-hafalan" className="font-bold underline text-white hover:text-amber-200">
                Detail Progres &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Menu Icons (Matching reference screenshot) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            Menu Fitur Utama
          </h2>
          <span className="text-xs text-slate-400">8 Modul Lengkap</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3.5">
          {quickMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <Link
                key={menu.title}
                to={menu.to}
                className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all group"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${menu.color} flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 mb-1.5 sm:mb-2`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 text-center leading-tight">
                  {menu.title}
                </span>
                <span className="text-[9px] text-slate-400 text-center mt-0.5 truncate hidden sm:block">
                  {menu.desc}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Section 2 Columns: Surah Pilihan / Terakhir Dibaca & Infaq Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Surah Pilihan (Matching screenshot) */}
        <div className="md:col-span-2 bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Surah Pilihan & Lanjutan Bacaan</h3>
              <p className="text-xs text-slate-500">Lanjutkan tilawah harian Anda</p>
            </div>
            <Link
              to="/quran"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Buka Al-Qur'an</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {/* Surah Al-Fatihah */}
            <Link
              to="/quran/1"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  01
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition">
                    Al-Fatihah
                  </h4>
                  <p className="text-xs text-slate-500">7 Ayat • Makkiyah • Pembukaan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-quran text-lg font-bold text-emerald-950">الفاتحة</span>
                <div className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-xs">
                  <Play className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>
            </Link>

            {/* Surah Al-Baqarah */}
            <Link
              to="/quran/2"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  02
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition">
                    Al-Baqarah
                  </h4>
                  <p className="text-xs text-slate-500">286 Ayat • Madaniyah • Sapi Betina</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-quran text-lg font-bold text-emerald-950">البقرة</span>
                <div className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center shadow-xs">
                  <Play className="w-3.5 h-3.5 ml-0.5" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Infaq & Shadaqah Card (Matching screenshot: Total Terkumpul Rp 5.250.000) */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Infaq & Shadaqah
              </span>
              <HeartHandshake className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-xs text-emerald-200">Total Dana Dakwah Terkumpul</p>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {formatRupiah(totalVerifiedInfaq)}
            </h3>
            <p className="text-[11px] text-emerald-300/80 leading-relaxed">
              Dialokasikan untuk mushaf tahfidz, beasiswa dhuafa, dan kegiatan keislaman UNINUS.
            </p>
          </div>

          <div className="pt-4 relative z-10">
            <Link
              to="/infaq"
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-2xl text-xs text-center shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Infaq Sekarang</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2 Columns: Riwayat Setoran Terbaru & Kegiatan Terdekat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Riwayat Setoran Terbaru (Matching exact screenshot) */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Riwayat Setoran Terbaru</h3>
              <p className="text-xs text-slate-500">Evaluasi hafalan oleh pembimbing</p>
            </div>
            <Link
              to="/setor-hafalan"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {memberSubmissions.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <Award className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                <p className="text-xs font-semibold text-slate-600">Belum ada riwayat setoran</p>
                <Link to="/setor-hafalan" className="inline-block mt-1 text-xs font-bold text-emerald-700 hover:underline">
                  Mulai Setor Hafalan &rarr;
                </Link>
              </div>
            ) : (
              memberSubmissions.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-emerald-50/40 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{sub.surahName}</span>
                      <span className="text-xs text-slate-500">
                        Ayat {sub.startAyah} - {sub.endAyah}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatShortDate(sub.submittedAt)} • {sub.mentorName.split(',')[0]}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {renderStatusBadge(sub.status)}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Jadwal Kegiatan Terdekat */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Jadwal Kegiatan Terdekat</h3>
              <p className="text-xs text-slate-500">Agenda dan bimbingan Ikraamul Qur’an</p>
            </div>
            <Link
              to="/kegiatan"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Jadwal Lengkap</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                <p className="text-xs font-semibold text-slate-600">Belum ada agenda kegiatan baru</p>
                <Link to="/kegiatan" className="inline-block mt-1 text-xs font-bold text-emerald-700 hover:underline">
                  Lihat Jadwal Lengkap &rarr;
                </Link>
              </div>
            ) : (
              activities.slice(0, 2).map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 hover:bg-emerald-50 transition"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-xs text-emerald-950">{act.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 shrink-0">
                      {act.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{act.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-emerald-100/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      {formatShortDate(act.startAt)}
                    </span>
                    <span className="truncate max-w-40 text-slate-400">{act.location}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pengumuman Terbaru */}
      {announcements.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider mb-2">
            <Megaphone className="w-4 h-4 text-amber-700" />
            <span>Informasi & Pengumuman Ikraamul Qur’an</span>
          </div>
          <div className="space-y-2">
            {announcements.map((ann) => (
              <div key={ann.id} className="text-xs text-amber-950/90 leading-relaxed">
                <strong className="font-bold text-amber-900">{ann.title}: </strong>
                {ann.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
