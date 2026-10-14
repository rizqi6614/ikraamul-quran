import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/services/store/appStore';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  CheckCircle,
  Sparkles,
  Trash2,
  Save,
  Volume2
} from 'lucide-react';
import { formatShortDate, formatDateTime, formatSecondsToTime } from '@/utils/formatters';

interface SavedRecording {
  id: string;
  title: string;
  date: string;
  duration: number;
  url: string;
}

export const TalaqqiPage: React.FC = () => {
  const { schedules, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'talaqqi' | 'murojaah'>('murojaah'); // Default murojaah to showcase live recorder

  // Recorder states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [recordingTitle, setRecordingTitle] = useState<string>('Murojaah Surah Al-Baqarah 1-10');
  const [savedRecordings, setSavedRecordings] = useState<SavedRecording[]>(() => {
    try {
      const saved = localStorage.getItem('iq_saved_recordings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const playbackRef = useRef<HTMLAudioElement | null>(null);

  // Sync saved recordings
  useEffect(() => {
    localStorage.setItem('iq_saved_recordings', JSON.stringify(savedRecordings));
  }, [savedRecordings]);

  // Clean up timer and audio on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Audio Context for real visualizer
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 64;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);
      setAudioBlobUrl(null);

      // Timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // Start Visualizer
      drawWaveform();
    } catch (err) {
      console.error('Error accessing microphone', err);
      alert('Izin mikrofon diperlukan untuk merekam murojaah. Pastikan mikrofon diizinkan di browser Anda.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.9 + 4;

        // Gradient Islamic Green
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#059669');
        gradient.addColorStop(1, '#34d399');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, (canvas.height - barHeight) / 2, barWidth - 2, barHeight, 4);
        ctx.fill();

        x += barWidth;
      }
    };

    render();
  };

  const handleSaveRecording = () => {
    if (!audioBlobUrl) return;
    const newRec: SavedRecording = {
      id: `rec-${Date.now()}`,
      title: recordingTitle || `Murojaah Mandiri ${new Date().toLocaleDateString('id-ID')}`,
      date: new Date().toISOString(),
      duration: recordingSeconds,
      url: audioBlobUrl
    };
    setSavedRecordings([newRec, ...savedRecordings]);
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    alert('Rekaman murojaah berhasil disimpan ke database lokal.');
  };

  const handleDeleteRecording = (id: string) => {
    setSavedRecordings(savedRecordings.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Talaqqi & Murojaah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bimbingan tahsin tatap muka bersama pembimbing & rekaman murojaah mandiri
          </p>
        </div>
      </div>

      {/* Tabs (Matching reference mockup) */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-sm mx-auto">
        <button
          onClick={() => setActiveTab('talaqqi')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'talaqqi'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Sesi Talaqqi
        </button>
        <button
          onClick={() => setActiveTab('murojaah')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'murojaah'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Murojaah Mandiri
        </button>
      </div>

      {/* Tab 1: Sesi Talaqqi */}
      {activeTab === 'talaqqi' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Sesi talaqqi dilaksanakan rutin di kampus UNINUS bersama pembimbing bersanad.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {schedules.map((sch) => (
              <div
                key={sch.id}
                className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs hover:border-emerald-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {sch.scheduleType}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900">{sch.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>
                      {sch.participantCount} / {sch.capacity} Santri
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {sch.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">{sch.mentorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>{formatDateTime(sch.startAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="truncate">{sch.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => alert(`Anda telah terdaftar pada sesi: ${sch.title}`)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    Ikuti Sesi Bimbingan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Murojaah Mandiri (Matching exact mockup: microphone, waveform, "Tap untuk mulai", "Rekaman akan tersimpan di database") */}
      {activeTab === 'murojaah' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-md text-center relative overflow-hidden">
            {/* Recording Title Input */}
            <div className="max-w-md mx-auto mb-6">
              <label className="block text-xs font-bold text-slate-500 mb-1 text-left">
                Judul Latihan / Surah
              </label>
              <input
                type="text"
                value={recordingTitle}
                onChange={(e) => setRecordingTitle(e.target.value)}
                disabled={isRecording}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none text-center"
              />
            </div>

            {/* Big Microphone Circle Button (Matching screenshot) */}
            <div className="my-6 flex flex-col items-center">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500 hover:bg-rose-600 text-white ring-8 ring-rose-200 animate-pulse'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-500 hover:scale-105 text-white ring-8 ring-emerald-100'
                }`}
              >
                {isRecording ? (
                  <Square className="w-10 h-10 fill-white" />
                ) : (
                  <Mic className="w-12 h-12" />
                )}
              </button>

              <p className="mt-4 font-bold text-sm text-slate-800">
                {isRecording ? 'Sedang Merekam Suara...' : 'Tap untuk mulai'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Rekaman akan tersimpan di database untuk dievaluasi
              </p>

              {/* Timer */}
              {isRecording && (
                <div className="mt-3 px-4 py-1.5 bg-rose-50 border border-rose-200 rounded-full text-rose-700 font-extrabold text-sm tracking-wider">
                  {formatSecondsToTime(recordingSeconds)}
                </div>
              )}
            </div>

            {/* Live Audio Visualizer Canvas */}
            <div className="max-w-md mx-auto h-20 bg-slate-50 rounded-2xl border border-slate-200 p-2 flex items-center justify-center overflow-hidden">
              <canvas
                ref={canvasRef}
                width={360}
                height={60}
                className="w-full h-full"
              />
            </div>

            {/* Recorded Audio Preview & Save */}
            {audioBlobUrl && !isRecording && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 max-w-md mx-auto space-y-3 animate-in zoom-in-95">
                <p className="text-xs font-bold text-emerald-900 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Rekaman Selesai ({formatSecondsToTime(recordingSeconds)})</span>
                </p>
                <audio controls src={audioBlobUrl} className="w-full h-10 rounded-lg" />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveRecording}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan ke Database</span>
                  </button>
                  <button
                    onClick={() => setAudioBlobUrl(null)}
                    className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Recordings List */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
            <h3 className="font-extrabold text-sm text-slate-900 mb-3">
              Daftar Rekaman Murojaah Tersimpan ({savedRecordings.length})
            </h3>

            {savedRecordings.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Belum ada rekaman tersimpan. Tekan ikon mikrofon di atas untuk mulai latihan.
              </p>
            ) : (
              <div className="space-y-3">
                {savedRecordings.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{rec.title}</h4>
                        <p className="text-[11px] text-slate-400">
                          {formatDateTime(rec.date)} • Durasi {formatSecondsToTime(rec.duration)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <audio controls src={rec.url} className="h-8 max-w-48" />
                      <button
                        onClick={() => handleDeleteRecording(rec.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition"
                        title="Hapus rekaman"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
