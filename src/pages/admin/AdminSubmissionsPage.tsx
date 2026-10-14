import React, { useState } from 'react';
import { useAppStore } from '@/services/store/appStore';
import { MemorizationSubmission, SubmissionStatus } from '@/types';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Search,
  Sliders,
  X,
  Star,
  Check
} from 'lucide-react';
import { formatDateTime, formatShortDate } from '@/utils/formatters';

export const AdminSubmissionsPage: React.FC = () => {
  const { submissions, reviewSubmission, currentUser } = useAppStore();

  const [statusFilter, setStatusFilter] = useState<'all' | 'menunggu' | 'diterima' | 'perlu_perbaikan'>('menunggu');
  const [selectedSub, setSelectedSub] = useState<MemorizationSubmission | null>(null);

  // Review form states
  const [fluency, setFluency] = useState<number>(90);
  const [tajwid, setTajwid] = useState<number>(88);
  const [makhraj, setMakhraj] = useState<number>(90);
  const [feedback, setFeedback] = useState<string>('Alhamdulillah lancar dan tartil.');
  const [decision, setDecision] = useState<SubmissionStatus>('diterima');

  const filtered = submissions.filter((s) => {
    if (statusFilter === 'all') return true;
    return s.status === statusFilter;
  });

  const handleOpenReview = (sub: MemorizationSubmission) => {
    setSelectedSub(sub);
    setFluency(sub.fluencyScore || 90);
    setTajwid(sub.tajwidScore || 88);
    setMakhraj(sub.makhrajScore || 90);
    setFeedback(sub.feedback || 'Mumtaz! Pertahankan konsistensi tartil dan makhraj.');
    setDecision('diterima');
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    await reviewSubmission(
      selectedSub.id,
      decision,
      { fluency, tajwid, makhraj },
      feedback
    );

    setSelectedSub(null);
    alert(`Setoran berhasil diverifikasi dengan status: ${decision.toUpperCase()}! Progres hafalan anggota telah otomatis diperbarui.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Setoran Hafalan Tahfidz
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluasi makharijul huruf, kaidah tajwid, dan kelancaran setoran santri
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['menunggu', 'all', 'diterima', 'perlu_perbaikan'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              statusFilter === st
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st === 'menunggu'
              ? 'Menunggu Diperiksa'
              : st === 'all'
              ? 'Semua Setoran'
              : st === 'diterima'
              ? 'Telah Diterima'
              : 'Perlu Perbaikan'}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-emerald-50/20 transition"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">
                  {sub.memberName} ({sub.memberNim})
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {sub.submissionType.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-800">
                Surah {sub.surahName} • Ayat {sub.startAyah} - {sub.endAyah}
              </p>
              <p className="text-[11px] text-slate-400">
                Diajukan pada: {formatDateTime(sub.submittedAt)}
              </p>
              {sub.feedback && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-xl mt-2">
                  Catatan Evaluasi: “{sub.feedback}”
                </p>
              )}
            </div>

            {/* Score & Action Button */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              {sub.fluencyScore !== undefined && (
                <div className="text-right text-xs pr-2 hidden sm:block">
                  <span className="font-extrabold text-emerald-700">
                    Skor: {Math.round((sub.fluencyScore + (sub.tajwidScore || 0) + (sub.makhrajScore || 0)) / 3)}/100
                  </span>
                </div>
              )}

              <button
                onClick={() => handleOpenReview(sub)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>{sub.status === 'menunggu' ? 'Periksa & Nilai' : 'Ubah Penilaian'}</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs">Tidak ada setoran dalam kategori ini.</p>
          </div>
        )}
      </div>

      {/* Assessment Scoring Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Lembar Penilaian Tahfidz
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedSub.memberName}
                </h3>
                <p className="text-xs text-slate-500">
                  Surah {selectedSub.surahName} (Ayat {selectedSub.startAyah} - {selectedSub.endAyah})
                </p>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-3.5 text-xs">
              {/* Decision */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keputusan Verifikasi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecision('diterima')}
                    className={`py-2 px-3 rounded-xl font-bold transition text-center cursor-pointer ${
                      decision === 'diterima'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Setujui (Diterima) ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecision('perlu_perbaikan')}
                    className={`py-2 px-3 rounded-xl font-bold transition text-center cursor-pointer ${
                      decision === 'perlu_perbaikan'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Perlu Perbaikan ⚠
                  </button>
                </div>
              </div>

              {/* Three Metric Sliders */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>1. Kelancaran (Fluency)</span>
                    <span className="text-emerald-700 font-extrabold">{fluency} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={fluency}
                    onChange={(e) => setFluency(parseInt(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>2. Tajwid (Mad, Ghunnah, Idgham)</span>
                    <span className="text-emerald-700 font-extrabold">{tajwid} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={tajwid}
                    onChange={(e) => setTajwid(parseInt(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>3. Makharijul Huruf & Shifat</span>
                    <span className="text-emerald-700 font-extrabold">{makhraj} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={makhraj}
                    onChange={(e) => setMakhraj(parseInt(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>

              {/* Feedback Note */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan Koreksi / Evaluasi Pembimbing
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Simpan Hasil Verifikasi
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
