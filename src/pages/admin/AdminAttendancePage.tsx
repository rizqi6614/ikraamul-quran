import React, { useState } from 'react';
import { useAppStore } from '@/services/store/appStore';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Calendar,
  Clock,
  Plus,
  Users,
  CheckCircle2,
  XCircle,
  Download,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';
import { formatDateTime, formatShortDate } from '@/utils/formatters';

export const AdminAttendancePage: React.FC = () => {
  const {
    activities,
    attendanceSessions,
    attendanceRecords,
    createAttendanceSession,
    closeAttendanceSession,
    deleteAttendanceSession,
    manualMarkAttendance,
    allUsers
  } = useAppStore();

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    activities[0]?.id || ''
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [activeSessionForQR, setActiveSessionForQR] = useState<string | null>(
    attendanceSessions.find((s) => s.status === 'open')?.id || null
  );

  const selectedSession = attendanceSessions.find((s) => s.id === activeSessionForQR);
  const sessionRecords = attendanceRecords.filter((r) => r.sessionId === selectedSession?.id);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const act = activities.find((a) => a.id === selectedActivityId) || activities[0];
    if (!act) return;

    const session = await createAttendanceSession(act.id, act.title, durationMinutes);
    setActiveSessionForQR(session.id);
    setShowCreateModal(false);
    alert(`Sesi absensi baru "${session.sessionCode}" berhasil dibuka!`);
  };

  const handleExportCSV = () => {
    if (!selectedSession || sessionRecords.length === 0) {
      alert('Tidak ada data absensi untuk diekspor.');
      return;
    }

    const headers = 'ID,Nama Lengkap,NIM,Kegiatan,Waktu Absen,Status,Metode\n';
    const rows = sessionRecords
      .map(
        (r) =>
          `"${r.id}","${r.memberName}","${r.memberNim}","${selectedSession.activityTitle}","${r.checkInAt}","${r.attendanceStatus}","${r.verificationMethod}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap_absensi_${selectedSession.sessionCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Sesi Absensi & Generator QR Code
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola sesi presensi kegiatan, buat QR code dinamis, dan ekspor laporan rekapitulasi
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buka Sesi Absensi Baru</span>
        </button>
      </div>

      {/* 2 Columns: QR Code Display Card & Session Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* QR Code Presentation Card */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md text-center flex flex-col items-center justify-between space-y-4">
          <div className="space-y-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                selectedSession?.status === 'open'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {selectedSession?.status === 'open' ? 'Sesi Aktif' : 'Sesi Ditutup'}
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 mt-1 line-clamp-1">
              {selectedSession?.activityTitle || 'Pilih Sesi'}
            </h3>
            <p className="text-xs text-slate-500">
              Kode Sesi: <strong className="font-mono text-emerald-800 text-sm">{selectedSession?.sessionCode || '-'}</strong>
            </p>
          </div>

          {/* Real Dynamic QR Code SVG */}
          {selectedSession ? (
            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500 shadow-sm">
              <QRCodeSVG
                value={selectedSession.sessionCode}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>
          ) : (
            <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xs">
              Pilih sesi di samping
            </div>
          )}

          <div className="w-full space-y-2">
            <p className="text-[11px] text-slate-400">
              Tampilkan QR Code ini di layar proyektor ruang kegiatan agar dipindai santri
            </p>
            {selectedSession?.status === 'open' && (
              <button
                onClick={() => closeAttendanceSession(selectedSession.id)}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition"
              >
                Tutup Sesi Ini Sekarang
              </button>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Daftar Sesi Absensi</h3>
            <span className="text-xs text-slate-500">{attendanceSessions.length} Sesi Terdata</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {attendanceSessions.map((ses) => (
              <div
                key={ses.id}
                onClick={() => setActiveSessionForQR(ses.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  selectedSession?.id === ses.id
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">
                      {ses.activityTitle}
                    </span>
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded font-bold">
                      {ses.sessionCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Batas aktif: {formatDateTime(ses.endAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ses.status === 'open'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ses.status === 'open' ? 'Buka' : 'Tutup'}
                  </span>

                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm(`Apakah Anda yakin ingin menghapus sesi absensi "${ses.sessionCode}" (${ses.activityTitle})?`)) {
                        await deleteAttendanceSession(ses.id);
                        if (activeSessionForQR === ses.id) setActiveSessionForQR(null);
                        alert('Sesi absensi berhasil dihapus.');
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Hapus sesi absensi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendees Table & Export CSV */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Rekap Kehadiran Peserta: {selectedSession?.activityTitle}
            </h3>
            <p className="text-xs text-slate-500">
              Total {sessionRecords.length} anggota hadir tercatat
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Rekap (CSV)</span>
          </button>
        </div>

        {sessionRecords.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">
            Belum ada data presensi yang masuk untuk sesi ini.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessionRecords.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{rec.memberName}</h4>
                  <p className="text-[11px] text-slate-400">
                    NIM: {rec.memberNim} • Masuk: {formatDateTime(rec.checkInAt)} ({rec.verificationMethod})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    {rec.attendanceStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Create Session */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">Buka Sesi Absensi Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Kegiatan</label>
                <select
                  value={selectedActivityId}
                  onChange={(e) => setSelectedActivityId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-slate-900"
                >
                  {activities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Masa Berlaku Sesi (Menit)
                </label>
                <input
                  type="number"
                  min="15"
                  max="360"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 60)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Buka Sesi & Generate QR
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold"
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
