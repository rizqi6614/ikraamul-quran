import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '@/services/store/appStore';
import { SURAH_LIST } from '@/services/quran/quranData';
import {
  Award,
  Calendar,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  BookOpen,
  User,
  Star,
  Info,
  X,
  Trash2,
  Search,
  Sparkles,
  ExternalLink,
  Filter
} from 'lucide-react';
import { formatShortDate, formatDateTime } from '@/utils/formatters';
import { MemorizationSubmission, SubmissionType } from '@/types';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const DEFAULT_MENTORS = [
  { uid: 'admin-iqbal-01', fullName: 'Ust. Muhammad Iqbal, Lc., M.Ag.', role: 'admin' },
  { uid: 'admin-denar-02', fullName: 'Ust. Denar Mulia Swara, M.Ag.', role: 'admin' },
  { uid: 'admin-fatimah-03', fullName: 'Ustadzah Siti Fatimah, S.Pd.I.', role: 'admin' },
  { uid: 'admin-fauzi-04', fullName: 'Dr. H. Ahmad Fauzi, M.Ag.', role: 'admin' }
];

export const SetorHafalanPage: React.FC = () => {
  const {
    currentUser,
    memberSubmissions,
    submissions,
    submitMemorization,
    deleteSubmission,
    allUsers,
    isAdmin
  } = useAppStore();

  const navigate = useNavigate();

  // Surah search & select
  const [surahSearch, setSurahSearch] = useState<string>('');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(2); // Default Al-Baqarah
  const [surahFilterTab, setSurahFilterTab] = useState<'all' | 'juz30' | 'populer'>('all');

  // Setoran range & details
  const [startAyah, setStartAyah] = useState<number>(1);
  const [endAyah, setEndAyah] = useState<number>(10);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('hafalan_baru');
  const [mentorId, setMentorId] = useState<string>('admin-iqbal-01');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  // History filtering & view tab (for admins: personal vs all members)
  const [historyTab, setHistoryTab] = useState<'mine' | 'all'>('mine');
  const [statusFilter, setStatusFilter] = useState<'all' | 'menunggu' | 'diterima' | 'perlu_perbaikan'>('all');

  // Selected submission modal for viewing detailed evaluation score
  const [selectedDetail, setSelectedDetail] = useState<MemorizationSubmission | null>(null);

  // Filtered surah list based on search and quick tabs
  const filteredSurahs = useMemo(() => {
    let list = SURAH_LIST;
    if (surahFilterTab === 'juz30') {
      list = list.filter((s) => s.number >= 78);
    } else if (surahFilterTab === 'populer') {
      const popularNumbers = [1, 18, 36, 55, 56, 67, 78, 112, 113, 114];
      list = list.filter((s) => popularNumbers.includes(s.number));
    }

    if (surahSearch.trim()) {
      const q = surahSearch.toLowerCase().trim();
      return list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.nameArabic.includes(q) ||
          s.number.toString() === q
      );
    }
    return list;
  }, [surahSearch, surahFilterTab]);

  const currentSurah = useMemo(() => {
    return SURAH_LIST.find((s) => s.number === selectedSurahNumber) || SURAH_LIST[1];
  }, [selectedSurahNumber]);

  // Robust mentor list combining database users and default official UNINUS tahfidz mentors
  const mentors = useMemo(() => {
    const list = [...DEFAULT_MENTORS];
    const registeredMentors = allUsers.filter(
      (u) => u.role === 'admin' || (u.programStudi && u.programStudi.toLowerCase().includes('pembimbing'))
    );
    registeredMentors.forEach((rm) => {
      if (!list.some((m) => m.uid === rm.uid || m.fullName.toLowerCase() === rm.fullName.toLowerCase())) {
        list.push({ uid: rm.uid, fullName: rm.fullName, role: 'admin' });
      }
    });
    return list;
  }, [allUsers]);

  // Sync mentorId if not existing
  useEffect(() => {
    if (mentors.length > 0 && !mentors.some((m) => m.uid === mentorId)) {
      setMentorId(mentors[0].uid);
    }
  }, [mentors, mentorId]);

  const handleSurahSelect = (num: number) => {
    setSelectedSurahNumber(num);
    setStartAyah(1);
    const surah = SURAH_LIST.find((s) => s.number === num);
    setEndAyah(Math.min(10, surah?.numberOfAyahs || 10));
  };

  const setAyahPreset = (count: number) => {
    const max = currentSurah.numberOfAyahs;
    setEndAyah(Math.min(max, startAyah + count - 1));
  };

  const setFullSurah = () => {
    setStartAyah(1);
    setEndAyah(currentSurah.numberOfAyahs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Harap masuk terlebih dahulu.');
      return;
    }
    if (startAyah < 1 || endAyah < startAyah || endAyah > currentSurah.numberOfAyahs) {
      alert(`Nomor ayat harus antara 1 sampai ${currentSurah.numberOfAyahs}.`);
      return;
    }

    setIsSubmitting(true);
    const selectedMentor = mentors.find((m) => m.uid === mentorId) || mentors[0];

    try {
      await submitMemorization({
        memberId: currentUser.uid,
        surahNumber: currentSurah.number,
        surahName: currentSurah.name,
        startAyah,
        endAyah,
        submissionType,
        mentorId: selectedMentor?.uid || 'admin-iqbal-01',
        mentorName: selectedMentor?.fullName || 'Ust. Muhammad Iqbal, Lc., M.Ag.',
        feedback: notes.trim() ? `Catatan santri: ${notes.trim()}` : undefined
      });

      // Celebration effect
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65 }
        });
      } catch (err) {
        // confetti fallback
      }

      setSuccessAlert(`Alhamdulillah! Setoran Surah ${currentSurah.name} (Ayat ${startAyah} - ${endAyah}) berhasil dikirim dan tersimpan di database.`);
      setNotes('');

      // Auto-scroll to history
      setTimeout(() => {
        const histElem = document.getElementById('riwayat-setoran');
        if (histElem) {
          histElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);

      setTimeout(() => setSuccessAlert(null), 5000);
    } catch (err: any) {
      alert(`Gagal mengirim setoran: ${err?.message || 'Terjadi kesalahan sistem'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine which list of submissions to show
  const activeSubmissionsList = useMemo(() => {
    const baseList = isAdmin && historyTab === 'all' ? submissions : memberSubmissions;
    if (statusFilter === 'all') return baseList;
    return baseList.filter((s) => s.status === statusFilter);
  }, [isAdmin, historyTab, submissions, memberSubmissions, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'diterima':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Diterima
          </span>
        );
      case 'sedang_diperiksa':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Sedang Diperiksa
          </span>
        );
      case 'perlu_perbaikan':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Perlu Perbaikan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Menunggu
          </span>
        );
    }
  };

  const totalVersesCount = Math.max(0, endAyah - startAyah + 1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800">
              Tahfidz Online UNINUS
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-emerald-700">
              {currentUser?.fullName || 'Santri'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Setor Hafalan Al-Qur’an
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ajukan setoran tahfidz atau murojaah harian kepada pembimbing secara resmi & tersimpan di database
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 flex items-center justify-center shrink-0">
          <Award className="w-6 h-6" />
        </div>
      </div>

      {/* Success Alert Banner */}
      {successAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-emerald-950">Pengajuan Setoran Berhasil Disimpan!</p>
            <p className="text-emerald-800 mt-0.5 leading-relaxed">{successAlert}</p>
            <p className="text-[11px] text-emerald-700 mt-1">
              Data telah tersimpan di riwayat dan database Firestore. Ustadz pembimbing akan menyimak dan mengevaluasi kelancaran & makhraj hafalan Anda.
            </p>
          </div>
          <button
            onClick={() => setSuccessAlert(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Submission Form Card */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Formulir Pengajuan Setoran</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pilih surah, tentukan rentang ayat, dan pilih Ustadz pembimbing tahfidz
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
            Tersimpan Otomatis
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pilih Surah with Quick Filters */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Pilih Surah</label>
              <div className="flex items-center gap-1">
                {(['all', 'juz30', 'populer'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSurahFilterTab(tab)}
                    className={`text-[10px] px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                      surahFilterTab === tab
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab === 'all' ? '114 Surah' : tab === 'juz30' ? 'Juz 30' : 'Surah Pilihan'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick search input if user wants to type */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={surahSearch}
                onChange={(e) => setSurahSearch(e.target.value)}
                placeholder="Cari nama surah (cth: Al-Baqarah, Yasin, Al-Mulk, An-Nas)..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              />
              {surahSearch && (
                <button
                  type="button"
                  onClick={() => setSurahSearch('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={selectedSurahNumber}
                onChange={(e) => handleSurahSelect(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              >
                {filteredSurahs.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name} ({s.numberOfAyahs} Ayat - {s.revelation})
                  </option>
                ))}
              </select>
            </div>

            {/* Surah quick info card */}
            <div className="mt-2.5 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-emerald-950">
                    {currentSurah.number}. {currentSurah.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {currentSurah.revelation}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                  Total: {currentSurah.numberOfAyahs} Ayat • {currentSurah.translation}
                </p>
              </div>
              <span className="font-quran text-2xl font-bold text-emerald-950">
                {currentSurah.nameArabic}
              </span>
            </div>
          </div>

          {/* Range Ayat */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Rentang Ayat yang Disetor</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAyahPreset(5)}
                  className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  +5 Ayat
                </button>
                <button
                  type="button"
                  onClick={() => setAyahPreset(10)}
                  className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                >
                  +10 Ayat
                </button>
                <button
                  type="button"
                  onClick={setFullSurah}
                  className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition"
                >
                  Semua Ayat ({currentSurah.numberOfAyahs})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Ayat Awal (Min: 1)
                </label>
                <input
                  type="number"
                  min="1"
                  max={currentSurah.numberOfAyahs}
                  value={startAyah}
                  onChange={(e) => setStartAyah(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Ayat Akhir (Maks: {currentSurah.numberOfAyahs})
                </label>
                <input
                  type="number"
                  min={startAyah}
                  max={currentSurah.numberOfAyahs}
                  value={endAyah}
                  onChange={(e) => setEndAyah(parseInt(e.target.value) || startAyah)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>
                Jumlah Hafalan: <strong className="text-emerald-700 font-bold">{totalVersesCount} Ayat</strong>
              </span>
              <span>
                Surah {currentSurah.name}: Ayat {startAyah} s/d {endAyah}
              </span>
            </div>
          </div>

          {/* Jenis Setoran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Jenis Setoran Tahfidz
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'hafalan_baru', label: 'Hafalan Baru', desc: 'Ayat baru disetor' },
                { id: 'murojaah', label: 'Murojaah', desc: 'Pengulangan hafalan' },
                { id: 'perbaikan', label: 'Perbaikan', desc: 'Koreksi tajwid / makhraj' }
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setSubmissionType(t.id as SubmissionType)}
                  className={`p-2.5 rounded-2xl text-center transition cursor-pointer border ${
                    submissionType === t.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{t.label}</p>
                  <p className={`text-[10px] mt-0.5 ${submissionType === t.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {t.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Pembimbing */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ustadz / Dosen Pembimbing Tahfidz UNINUS
            </label>
            <div className="relative">
              <select
                value={mentorId}
                onChange={(e) => setMentorId(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {mentors.map((m) => (
                  <option key={m.uid} value={m.uid}>
                    {m.fullName}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Setoran akan diarahkan ke pembimbing yang Anda pilih untuk dinilai kelancaran dan tajwidnya.
            </p>
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Tambahan untuk Pembimbing (Opsional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Sudah setor tatap muka di Masjid Ulil Albab UNINUS ba'da Ashar"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Menyimpan & Mengirim Setoran...' : 'Mulai Setor Hafalan'}</span>
          </button>
        </form>
      </div>

      {/* Riwayat Setoran Section */}
      <div id="riwayat-setoran" className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900">Riwayat Setoran Hafalan</h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {activeSubmissionsList.length} Setoran
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Data riwayat setoran hafalan tersimpan di sistem dan database Firestore
            </p>
          </div>

          {/* If admin, toggle personal vs all */}
          {isAdmin && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setHistoryTab('mine')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                  historyTab === 'mine' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Setoran Saya
              </button>
              <button
                type="button"
                onClick={() => setHistoryTab('all')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                  historyTab === 'all' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Santri ({submissions.length})
              </button>
            </div>
          )}
        </div>

        {/* Filter status tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-0.5" />
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'menunggu', label: 'Menunggu' },
            { id: 'diterima', label: 'Diterima' },
            { id: 'perlu_perbaikan', label: 'Perlu Perbaikan' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer text-[11px] ${
                statusFilter === st.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {activeSubmissionsList.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-600">Belum ada riwayat setoran hafalan</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Silakan isi formulir di atas dan klik &ldquo;Mulai Setor Hafalan&rdquo; untuk mengajukan setoran baru.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeSubmissionsList.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedDetail(sub)}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition cursor-pointer group shadow-2xs hover:shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-800">
                      Surah {sub.surahName}
                    </h4>
                    <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      Ayat {sub.startAyah} - {sub.endAyah}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {sub.submissionType.replace('_', ' ')}
                    </span>
                    {isAdmin && historyTab === 'all' && (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">
                        Santri: {sub.memberName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span>{formatDateTime(sub.submittedAt)}</span>
                    <span>•</span>
                    <span>Pembimbing: {sub.mentorName.split(',')[0]}</span>
                  </p>
                  {sub.feedback && (
                    <p className="text-[11px] text-slate-600 italic line-clamp-1 bg-white/70 px-2 py-0.5 rounded border border-slate-100 inline-block">
                      {sub.feedback}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {getStatusBadge(sub.status)}
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus data setoran Surah ${sub.surahName} (Ayat ${sub.startAyah}-${sub.endAyah})?\nData akan dihapus permanen dari sistem.`)) {
                        await deleteSubmission(sub.id);
                        alert('Setoran berhasil dihapus.');
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Hapus setoran"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Detail Evaluasi Setoran
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Surah {selectedDetail.surahName} (Ayat {selectedDetail.startAyah} - {selectedDetail.endAyah})
                </h3>
                <p className="text-xs text-slate-500">
                  Santri: <strong className="text-slate-800">{selectedDetail.memberName}</strong> ({selectedDetail.memberNim || '-'})
                </p>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Status</span>
                <span>{getStatusBadge(selectedDetail.status)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Jenis Setoran</span>
                <span className="font-bold text-slate-800 uppercase">{selectedDetail.submissionType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Pembimbing</span>
                <span className="font-semibold text-slate-800">{selectedDetail.mentorName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Waktu Pengajuan</span>
                <span className="text-slate-700">{formatDateTime(selectedDetail.submittedAt)}</span>
              </div>

              {/* Assessment Scores if reviewed */}
              {selectedDetail.fluencyScore !== undefined ? (
                <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 space-y-2 mt-2">
                  <p className="font-bold text-emerald-950 mb-1">Hasil Penilaian Pembimbing:</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl shadow-2xs border border-emerald-100">
                      <p className="text-[10px] text-slate-500">Kelancaran</p>
                      <p className="font-extrabold text-sm text-emerald-700">
                        {selectedDetail.fluencyScore}/100
                      </p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl shadow-2xs border border-emerald-100">
                      <p className="text-[10px] text-slate-500">Tajwid</p>
                      <p className="font-extrabold text-sm text-emerald-700">
                        {selectedDetail.tajwidScore}/100
                      </p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl shadow-2xs border border-emerald-100">
                      <p className="text-[10px] text-slate-500">Makhraj</p>
                      <p className="font-extrabold text-sm text-emerald-700">
                        {selectedDetail.makhrajScore}/100
                      </p>
                    </div>
                  </div>
                  {selectedDetail.feedback && (
                    <div className="mt-3 pt-2 border-t border-emerald-200/60">
                      <p className="text-[11px] font-bold text-emerald-900">Catatan Koreksi:</p>
                      <p className="text-xs text-slate-700 mt-0.5 italic leading-relaxed">
                        &ldquo;{selectedDetail.feedback}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 rounded-2xl text-slate-600 text-xs text-center border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-800">Menunggu Penilaian Pembimbing</p>
                  <p className="text-[11px] text-slate-500">
                    Setoran ini sedang mengantre untuk diperiksa dan dinilai oleh pembimbing tahfidz UNINUS.
                  </p>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDetail(null);
                        navigate('/admin/setoran');
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-2xs transition"
                    >
                      <span>Buka Panel Review Admin</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={async () => {
                  if (
                    confirm(
                      `Apakah Anda yakin ingin menghapus data setoran Surah ${selectedDetail.surahName} (Ayat ${selectedDetail.startAyah}-${selectedDetail.endAyah})?\nData akan dihapus secara permanen.`
                    )
                  ) {
                    await deleteSubmission(selectedDetail.id);
                    setSelectedDetail(null);
                    alert('Setoran hafalan berhasil dihapus.');
                  }
                }}
                className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Setoran</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
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
