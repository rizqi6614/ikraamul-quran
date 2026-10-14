import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/services/store/appStore';
import {
  QrCode,
  Camera,
  CheckCircle2,
  Clock,
  AlertCircle,
  Hash,
  History,
  X,
  Sparkles,
  CameraOff,
  RefreshCw
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { formatDateTime, formatShortDate } from '@/utils/formatters';
import confetti from 'canvas-confetti';

export const AbsensiPage: React.FC = () => {
  const {
    attendanceSessions,
    memberAttendanceRecords,
    recordAttendance,
    currentUser
  } = useAppStore();

  const [sessionCodeInput, setSessionCodeInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Active open sessions
  const activeSessions = attendanceSessions.filter((s) => s.status === 'open');

  const startScanner = async () => {
    setIsScanning(true);
    setCameraLoading(true);
    setCameraError(null);
    setFeedback(null);

    // Give DOM a frame to render #qr-reader-container
    setTimeout(async () => {
      try {
        const container = document.getElementById('qr-reader-container');
        if (!container) return;

        // Clean previous instance if any
        if (html5QrCodeRef.current) {
          try {
            if (html5QrCodeRef.current.isScanning) {
              await html5QrCodeRef.current.stop();
            }
            await html5QrCodeRef.current.clear();
          } catch (e) {}
        }

        const scanner = new Html5Qrcode('qr-reader-container');
        html5QrCodeRef.current = scanner;

        const qrConfig = {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        };

        const onScanSuccess = async (decodedText: string) => {
          if (navigator.vibrate) {
            try {
              navigator.vibrate(100);
            } catch (e) {}
          }
          await stopScanner();
          handleProcessCode(decodedText);
        };

        // Try environment camera (back camera) first, then fallback to user/default camera
        try {
          await scanner.start({ facingMode: 'environment' }, qrConfig, onScanSuccess, () => {});
        } catch (envErr) {
          console.warn('Back camera failed, trying user camera...', envErr);
          await scanner.start({ facingMode: 'user' }, qrConfig, onScanSuccess, () => {});
        }

        setCameraLoading(false);
      } catch (err: any) {
        console.error('Camera startup error:', err);
        setCameraLoading(false);
        setIsScanning(false);
        setCameraError(
          'Tidak dapat mengaktifkan kamera perangkat. Pastikan Anda telah memberikan izin kamera di browser Anda, atau gunakan kode sesi manual di bawah.'
        );
      }
    }, 150);
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (e) {
        console.warn('Scanner stop note:', e);
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
    setCameraLoading(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          if (html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().catch(() => {});
          }
        } catch (e) {}
      }
    };
  }, []);

  const handleProcessCode = async (code: string) => {
    setLoading(true);
    setFeedback(null);
    const res = await recordAttendance(code, notes);
    setLoading(false);
    setFeedback(res);

    if (res.success) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionCodeInput) return;
    handleProcessCode(sessionCodeInput);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Absensi Anggota
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Presensi kehadiran kegiatan dan bimbingan tahfidz menggunakan QR Code
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <QrCode className="w-5 h-5" />
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-3 animate-in fade-in ${
            feedback.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <div>
            <p className="font-bold">{feedback.success ? 'Berhasil' : 'Gagal'}</p>
            <p className="mt-0.5">{feedback.message}</p>
          </div>
        </div>
      )}

      {/* QR Scanner Frame (Matching exact screenshot: frame icon + "Scan QR untuk absen atau pilih manual" + "Absen Sekarang" button) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-md text-center space-y-6">
        <div className="max-w-xs mx-auto">
          {cameraError && (
            <div className="p-3 mb-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-left">
              <p className="font-bold flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Peringatan Kamera</span>
              </p>
              <p className="text-[11px] leading-relaxed">{cameraError}</p>
            </div>
          )}

          {isScanning ? (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-black min-h-[260px] flex items-center justify-center">
                <div id="qr-reader-container" className="w-full h-full" />
                {cameraLoading && (
                  <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white text-xs gap-2 z-10">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                    <span>Membuka kamera perangkat...</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={stopScanner}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CameraOff className="w-4 h-4" />
                <span>Tutup Kamera</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* QR Decorative Scanner Frame matching screenshot */}
              <div className="w-36 h-36 mx-auto rounded-3xl bg-emerald-50 border-2 border-dashed border-emerald-400/80 p-4 flex flex-col items-center justify-center relative">
                <QrCode className="w-16 h-16 text-emerald-700 animate-pulse" />
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-600" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-600" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-600" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-600" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800">
                  Scan QR untuk absen atau pilih manual
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Arahkan kamera ke QR Code yang ditampilkan pembimbing
                </p>
              </div>

              {/* Absen Sekarang Button (Matching screenshot) */}
              <button
                type="button"
                onClick={startScanner}
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Absen Sekarang (Buka Kamera)</span>
              </button>
            </div>
          )}
        </div>

        {/* Manual Code Input Option */}
        <div className="pt-4 border-t border-slate-100 max-w-sm mx-auto">
          <p className="text-xs font-bold text-slate-600 mb-2">
            Atau Masukkan Kode Sesi Absensi
          </p>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Hash className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Contoh: IQ-7892"
                value={sessionCodeInput}
                onChange={(e) => setSessionCodeInput(e.target.value.toUpperCase())}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !sessionCodeInput}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition cursor-pointer shrink-0"
            >
              {loading ? 'Validasi...' : 'Verifikasi'}
            </button>
          </form>

          {/* Quick Session helper for easy demo testing */}
          {activeSessions.length > 0 && (
            <div className="mt-3 p-2.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl text-left text-[11px] text-emerald-950 flex items-center justify-between">
              <div>
                <span className="font-bold">Sesi Aktif: </span>
                <span>{activeSessions[0].activityTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setSessionCodeInput(activeSessions[0].sessionCode)}
                className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded-lg text-[10px]"
              >
                Gunakan Kode ({activeSessions[0].sessionCode})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Riwayat Absensi (Matching exact screenshot: Senin, Jumat, Rabu - Hadir) */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Riwayat Absensi</h3>
            <p className="text-xs text-slate-500">Rekap kehadiran kegiatan milik Anda</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
            {memberAttendanceRecords.length} Kehadiran
          </span>
        </div>

        {memberAttendanceRecords.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            Belum ada riwayat kehadiran yang tercatat.
          </p>
        ) : (
          <div className="space-y-3">
            {memberAttendanceRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-emerald-50/30 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      {rec.activityTitle || 'Kegiatan Rutin'}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatDateTime(rec.checkInAt)} • Metode: {rec.verificationMethod}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Hadir
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
