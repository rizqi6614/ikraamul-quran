import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SURAH_LIST } from '@/services/quran/quranData';
import { useAppStore } from '@/services/store/appStore';
import { Search, BookOpen, Bookmark, Play, Filter } from 'lucide-react';

export const QuranListPage: React.FC = () => {
  const { bookmarks, lastRead } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Makkiyah' | 'Madaniyah'>('all');

  const filteredSurahs = SURAH_LIST.filter((surah) => {
    const matchesQuery =
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString() === searchQuery.trim();

    const matchesFilter = filterType === 'all' || surah.revelation === filterType;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Al-Qur’an Digital 30 Juz
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            114 Surah lengkap dengan teks Arab resmi Kemenag RI, terjemahan & murattal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            114 Surah • 6236 Ayat
          </span>
        </div>
      </div>

      {/* Last Read Card if available */}
      {lastRead && (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-md flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5 fill-amber-300" />
              <span>Terakhir Dibaca</span>
            </div>
            <h3 className="text-lg font-extrabold">
              Surah {lastRead.surahName} : Ayat {lastRead.ayahNumber}
            </h3>
            <p className="text-xs text-emerald-200">
              Lanjutkan tilawah harian Anda dari ayat ini
            </p>
          </div>
          <Link
            to={`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`}
            className="px-4 py-2 bg-white text-emerald-900 font-bold rounded-2xl text-xs hover:bg-emerald-50 transition shadow-sm relative z-10 shrink-0"
          >
            Lanjutkan
          </Link>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari surah (misal: Al-Baqarah, Yasin, 36, dll)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl shrink-0">
          {(['all', 'Makkiyah', 'Madaniyah'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === type
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {type === 'all' ? 'Semua' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Surah Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSurahs.map((surah) => (
          <Link
            key={surah.number}
            to={`/quran/${surah.number}`}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              {/* Surah Number Hexagon/Badge */}
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-xs flex items-center justify-center border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white transition">
                {surah.number}
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800 transition">
                  {surah.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {surah.translation} • {surah.numberOfAyahs} Ayat
                </p>
                <span className="text-[10px] text-slate-400 font-medium">
                  {surah.revelation}
                </span>
              </div>
            </div>

            {/* Arabic Script */}
            <div className="text-right">
              <span className="font-quran text-xl font-bold text-emerald-950 group-hover:text-emerald-700 transition">
                {surah.nameArabic}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold">Tidak ada surah yang cocok dengan pencarian.</p>
        </div>
      )}
    </div>
  );
};
