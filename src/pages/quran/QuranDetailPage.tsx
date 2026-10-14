import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSurahDetail, SURAH_LIST } from '@/services/quran/quranData';
import { useAppStore } from '@/services/store/appStore';
import { SurahDetail, AyahItem } from '@/types';
import {
  ArrowLeft,
  Play,
  Pause,
  Bookmark,
  Share2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Sliders,
  Check,
  CheckCheck
} from 'lucide-react';
import { formatSecondsToTime } from '@/utils/formatters';

export const QuranDetailPage: React.FC = () => {
  const { surahId } = useParams<{ surahId: string }>();
  const navigate = useNavigate();
  const surahNumber = parseInt(surahId || '1');

  const { bookmarks, toggleBookmark, lastRead, setLastReadAyah } = useAppStore();

  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [arabicFontSize, setArabicFontSize] = useState<number>(28); // 24 to 40px
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>('');
  const [activeAyahNumber, setActiveAyahNumber] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Fetch Surah Details
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }

    getSurahDetail(surahNumber).then((data) => {
      if (isMounted) {
        setSurah(data);
        setLoading(false);
        // Set default full audio
        if (data.audioFull) {
          setCurrentAudioUrl(data.audioFull);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [surahNumber]);

  // Audio Event Handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setActiveAyahNumber(null);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentAudioUrl]);

  const toggleFullSurahAudio = () => {
    if (!audioRef.current || !surah?.audioFull) return;

    if (currentAudioUrl !== surah.audioFull) {
      setCurrentAudioUrl(surah.audioFull);
      setActiveAyahNumber(null);
      setTimeout(() => {
        audioRef.current?.play();
        setIsPlaying(true);
      }, 100);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playAyahAudio = (ayah: AyahItem) => {
    if (!ayah.audio || !audioRef.current) return;

    if (currentAudioUrl === ayah.audio && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setCurrentAudioUrl(ayah.audio);
    setActiveAyahNumber(ayah.number);
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  const handleCopyAyah = (ayah: AyahItem) => {
    if (!surah) return;
    const text = `${ayah.arabic}\n\n"${ayah.translation}"\n(QS. ${surah.name}: ${ayah.number})`;
    navigator.clipboard.writeText(text);
    setCopiedAyah(ayah.number);
    setTimeout(() => setCopiedAyah(null), 2500);
  };

  const handleShareAyah = (ayah: AyahItem) => {
    if (!surah) return;
    const text = `${ayah.arabic}\n\n"${ayah.translation}"\n(QS. ${surah.name}: ${ayah.number})`;
    if (navigator.share) {
      navigator.share({
        title: `QS. ${surah.name}: ${ayah.number}`,
        text: text,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopyAyah(ayah);
      alert('Teks ayat berhasil disalin ke clipboard.');
    }
  };

  const isAyahBookmarked = (ayahNum: number) => {
    return bookmarks.some((b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNum);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-semibold text-slate-500">Memuat teks mushaf dan audio resmi...</p>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-sm font-bold text-slate-700">Surah tidak ditemukan.</p>
        <Link to="/quran" className="mt-4 inline-block text-xs font-bold text-emerald-700">
          Kembali ke Daftar Surah
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={currentAudioUrl} preload="auto" />

      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/quran"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Daftar Surah</span>
        </Link>

        {/* Font size controller */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-400 font-medium">Ukuran Arab:</span>
          <button
            onClick={() => setArabicFontSize(Math.max(22, arabicFontSize - 3))}
            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold flex items-center justify-center text-slate-700"
          >
            A-
          </button>
          <span className="text-xs font-semibold text-slate-800 min-w-6 text-center">
            {arabicFontSize}
          </span>
          <button
            onClick={() => setArabicFontSize(Math.min(44, arabicFontSize + 3))}
            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold flex items-center justify-center text-slate-700"
          >
            A+
          </button>
        </div>
      </div>

      {/* Surah Header Card (Matching screenshot style) */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white rounded-3xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dark opacity-20 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold tracking-widest uppercase bg-emerald-900/70 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-200">
            Surah Ke-{surah.number}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {surah.name}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            {surah.translation} • {surah.numberOfAyahs} Ayat • {surah.revelation}
          </p>
          <div className="pt-2">
            <span className="font-quran text-3xl sm:text-4xl font-bold text-amber-200">
              {surah.nameArabic}
            </span>
          </div>

          {/* Murattal play button in header */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={toggleFullSurahAudio}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold rounded-2xl text-xs shadow-md transition"
            >
              {isPlaying && activeAyahNumber === null ? (
                <>
                  <Pause className="w-4 h-4 fill-emerald-950" />
                  <span>Jeda Murattal Penuh</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-emerald-950" />
                  <span>Putar Murattal Penuh</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bismillah Card (Except for Surah At-Taubah) */}
      {surah.number !== 9 && (
        <div className="bg-white rounded-2xl p-6 text-center border border-emerald-100 shadow-2xs space-y-2">
          <p
            className="font-quran font-bold text-emerald-950"
            style={{ fontSize: `${arabicFontSize + 4}px` }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs text-slate-500 italic">
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
          </p>
        </div>
      )}

      {/* Ayahs List */}
      <div className="space-y-4">
        {surah.ayahs.map((ayah) => {
          const isBookmarked = isAyahBookmarked(ayah.number);
          const isThisPlaying = isPlaying && activeAyahNumber === ayah.number;

          return (
            <div
              key={ayah.number}
              id={`ayah-${ayah.number}`}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                isThisPlaying
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-md'
                  : 'border-slate-200/80 hover:border-emerald-200 shadow-2xs'
              }`}
            >
              {/* Ayah Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                    {ayah.number}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    QS. {surah.name}:{ayah.number}
                  </span>
                </div>

                {/* Ayah Actions: Audio, Bookmark, Last Read, Copy, Share */}
                <div className="flex items-center gap-1">
                  {/* Play audio per ayah */}
                  {ayah.audio && (
                    <button
                      onClick={() => playAyahAudio(ayah)}
                      className={`p-2 rounded-xl transition ${
                        isThisPlaying
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                      }`}
                      title="Dengarkan ayat ini"
                    >
                      {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                  )}

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(surah.number, surah.name, ayah.number)}
                    className={`p-2 rounded-xl transition ${
                      isBookmarked
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                    }`}
                    title={isBookmarked ? 'Hapus bookmark' : 'Tandai bookmark'}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                  </button>

                  {/* Set Last Read */}
                  <button
                    onClick={() => setLastReadAyah(surah.number, surah.name, ayah.number)}
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold transition ${
                      lastRead?.surahNumber === surah.number && lastRead?.ayahNumber === ayah.number
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                    title="Jadikan penanda terakhir dibaca"
                  >
                    {lastRead?.surahNumber === surah.number && lastRead?.ayahNumber === ayah.number
                      ? 'Terakhir Dibaca'
                      : 'Tandai Baca'}
                  </button>

                  {/* Copy */}
                  <button
                    onClick={() => handleCopyAyah(ayah)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition"
                    title="Salin ayat & terjemahan"
                  >
                    {copiedAyah === ayah.number ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => handleShareAyah(ayah)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition"
                    title="Bagikan ayat"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <div className="py-2">
                <p
                  className="font-quran font-bold text-slate-900 leading-loose"
                  style={{ fontSize: `${arabicFontSize}px` }}
                >
                  {ayah.arabic}
                </p>
              </div>

              {/* Indonesian Translation */}
              <div className="pt-3 border-t border-slate-100/80">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {ayah.translation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next Surah Pagination */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        {surah.number > 1 ? (
          <Link
            to={`/quran/${surah.number - 1}`}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Surah Sebelumnya</span>
          </Link>
        ) : (
          <div />
        )}

        {surah.number < 114 ? (
          <Link
            to={`/quran/${surah.number + 1}`}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-bold hover:bg-emerald-700 transition"
          >
            <span>Surah Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Sticky Bottom Audio Player Bar when playing */}
      {isPlaying && (
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-4 right-4 max-w-2xl mx-auto z-40 bg-slate-950/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div className="truncate">
              <p className="font-bold text-xs truncate">
                {activeAyahNumber
                  ? `Ayat ${activeAyahNumber} — Surah ${surah.name}`
                  : `Murattal Penuh: Surah ${surah.name}`}
              </p>
              <p className="text-[10px] text-emerald-300">
                Qari: Syaikh Misyari Rasyid Al-Afasy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {formatSecondsToTime(currentTime)} / {formatSecondsToTime(duration)}
            </span>
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
              }}
              className="p-2 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition"
            >
              <Pause className="w-4 h-4 fill-slate-900" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
