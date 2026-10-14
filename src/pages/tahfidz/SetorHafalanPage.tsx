import React, { useState } from 'react';
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
  Trash2
} from 'lucide-react';
import { formatShortDate, formatDateTime } from '@/utils/formatters';
import { MemorizationSubmission, SubmissionType } from '@/types';

export const SetorHafalanPage: React.FC = () => {
  const { currentUser, memberSubmissions, submitMemorization, deleteSubmission, allUsers } = useAppStore();

  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(2); // Default Al-Baqarah
  const [startAyah, setStartAyah] = useState<number>(1);
  const [endAyah, setEndAyah] = useState<number>(10);
  const [submissionType, setSubmissionType] = useState<SubmissionType>('hafalan_baru');
  const [mentorId, setMentorId] = useState<string>('admin-iqbal-01');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successAlert, setSuccessAlert] = useState<boolean>(false);

  // Selected submission modal for viewing detailed evaluation score
  const [selectedDetail, setSelectedDetail] = useState<MemorizationSubmission | null>(null);

  const currentSurah = SURAH_LIST.find((s) => s.number === selectedSurahNumber) || SURAH_LIST[1];
  const mentors = allUsers.filter((u) => u.role === 'admin' || u.programStudi.includes('Pembimbing'));

  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(e.target.value);
    setSelectedSurahNumber(num);
    setStartAyah(1);
    const surah = SURAH_LIST.find((s) => s.number === num);
    setEndAyah(Math.min(10, surah?.numberOfAyahs || 10));
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

    await submitMemorization({
      memberId: currentUser.uid,
      surahNumber: currentSurah.number,
      surahName: currentSurah.name,
      startAyah,
      endAyah,
      submissionType,
      mentorId: selectedMentor?.uid || 'admin-iqbal-01',
      mentorName: selectedMentor?.fullName || 'Ust. Muhammad Iqbal, Lc., M.Ag.',
      feedback: notes ? `Catatan santri: ${notes}` : undefined
    });

    setIsSubmitting(false);
    setSuccessAlert(true);
    setNotes('');
    setTimeout(() => setSuccessAlert(false), 4000);
  };

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header matching screenshot */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Setor Hafalan Al-Qur’an
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ajukan setoran tahfidz atau murojaah harian kepada pembimbing
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <Award className="w-5 h-5" />
        </div>
      </div>

      {successAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Pengajuan Setoran Berhasil Dikirim!</p>
            <p className="text-emerald-700 mt-0.5">
              Pembimbing akan menyimak dan memberikan penilaian (kelancaran, tajwid, & makhraj).
            </p>
          </div>
        </div>
      )}

      {/* Main Submission Form Card (Matching UI reference) */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pilih Surah */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Surah
            </label>
            <div className="relative">
              <select
                value={selectedSurahNumber}
                onChange={handleSurahChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              >
                {SURAH_LIST.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name} ({s.numberOfAyahs} Ayat - {s.revelation})
                  </option>
                ))}
              </select>
            </div>
            {/* Surah quick info card */}
            <div className="mt-2 p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-emerald-950">{currentSurah.name}</span>
                <span className="text-[11px] text-emerald-700 ml-2">
                  {currentSurah.numberOfAyahs} Ayat • {currentSurah.revelation}
                </span>
              </div>
              <span className="font-quran text-lg font-bold text-emerald-950">
                {currentSurah.nameArabic}
              </span>
            </div>
          </div>

          {/* Range Ayat */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ayat Awal
              </label>
              <input
                type="number"
                min="1"
                max={currentSurah.numberOfAyahs}
                value={startAyah}
                onChange={(e) => setStartAyah(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ayat Akhir
              </label>
              <input
                type="number"
                min={startAyah}
                max={currentSurah.numberOfAyahs}
                value={endAyah}
                onChange={(e) => setEndAyah(parseInt(e.target.value) || startAyah)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Jenis Setoran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Jenis Setoran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'hafalan_baru', label: 'Hafalan Baru' },
                { id: 'murojaah', label: 'Murojaah' },
                { id: 'perbaikan', label: 'Perbaikan' }
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setSubmissionType(t.id as SubmissionType)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition text-center ${
                    submissionType === t.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pembimbing */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ustadz / Pembimbing Tahfidz
            </label>
            <select
              value={mentorId}
              onChange={(e) => setMentorId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {mentors.length === 0 ? (
                <option value="admin-default">Ustadz Pembimbing Tahfidz UNINUS</option>
              ) : (
                mentors.map((m) => (
                  <option key={m.uid} value={m.uid}>
                    {m.fullName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Misal: Sudah setor tatap muka di Masjid Ulil Albab UNINUS"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Submit Button (Matching screenshot: Mulai Setor) */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Mengirim Pengajuan...' : 'Mulai Setor'}</span>
          </button>
        </form>
      </div>

      {/* Riwayat Setoran Section (Matching UI reference with chevron) */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Riwayat Setoran</h3>
            <p className="text-xs text-slate-500">Klik item untuk melihat catatan dan nilai pembimbing</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
            {memberSubmissions.length} Setoran
          </span>
        </div>

        {memberSubmissions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">Belum ada riwayat setoran hafalan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {memberSubmissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedDetail(sub)}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">
                      {sub.surahName}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Ayat {sub.startAyah} - {sub.endAyah}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                      {sub.submissionType.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {formatShortDate(sub.submittedAt)} • Pembimbing: {sub.mentorName.split(',')[0]}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(sub.status)}
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus data setoran Surah ${sub.surahName} (Ayat ${sub.startAyah}-${sub.endAyah})?`)) {
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Detail Evaluasi Setoran
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Surah {selectedDetail.surahName} (Ayat {selectedDetail.startAyah} - {selectedDetail.endAyah})
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span>{getStatusBadge(selectedDetail.status)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Pembimbing</span>
                <span className="font-semibold text-slate-800">{selectedDetail.mentorName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Waktu Pengajuan</span>
                <span className="text-slate-700">{formatDateTime(selectedDetail.submittedAt)}</span>
              </div>

              {/* Assessment Scores if reviewed */}
              {selectedDetail.fluencyScore !== undefined ? (
                <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 space-y-2 mt-2">
                  <p className="font-bold text-emerald-950 mb-1">Hasil Penilaian Pembimbing:</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-xl shadow-2xs">
                      <p className="text-[10px] text-slate-500">Kelancaran</p>
                      <p className="font-extrabold text-sm text-emerald-700">
                        {selectedDetail.fluencyScore}/100
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-2xs">
                      <p className="text-[10px] text-slate-500">Tajwid</p>
                      <p className="font-extrabold text-sm text-emerald-700">
                        {selectedDetail.tajwidScore}/100
                      </p>
                    </div>
                    <div className="bg-white p-2 rounded-xl shadow-2xs">
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
                        “{selectedDetail.feedback}”
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-xs italic text-center">
                  Setoran ini sedang mengantre untuk diperiksa dan dinilai oleh pembimbing.
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-5">
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
