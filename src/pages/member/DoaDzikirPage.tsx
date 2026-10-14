import React, { useState } from 'react';
import { DOA_LIST, DOA_CATEGORIES } from '@/services/quran/doaData';
import { DoaItem } from '@/types';
import { Search, Sparkles, Copy, Check, RotateCcw, Volume2, Bookmark } from 'lucide-react';

export const DoaDzikirPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Digital counter states mapped by doa id
  const [counters, setCounters] = useState<Record<string, number>>({});

  const filteredDoa = DOA_LIST.filter((doa) => {
    const matchesCat = selectedCategory === 'Semua' || doa.category === selectedCategory;
    const matchesSearch =
      doa.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doa.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleIncrement = (doa: DoaItem) => {
    const current = counters[doa.id] || 0;
    const target = doa.counterTarget || 1;
    if (current < target) {
      setCounters({ ...counters, [doa.id]: current + 1 });
      // Haptic vibration if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(40);
      }
    }
  };

  const handleResetCounter = (id: string) => {
    setCounters({ ...counters, [id]: 0 });
  };

  const handleCopy = (doa: DoaItem) => {
    const text = `${doa.title}\n\n${doa.arabic}\n\n${doa.transliteration || ''}\n\nArtinya:\n"${doa.translation}"\n(${doa.reference})`;
    navigator.clipboard.writeText(text);
    setCopiedId(doa.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Doa & Dzikir Harian
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kumpulan doa ma'tsur, Al-Ma'tsurat, dan wirid sunnah bersumber shahih
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari doa (misal: orang tua, masjid, istighfar)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none shadow-2xs"
          />
        </div>

        {/* Categories scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DOA_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-emerald-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Doa Cards List */}
      <div className="space-y-4">
        {filteredDoa.map((doa) => {
          const currentCount = counters[doa.id] || 0;
          const targetCount = doa.counterTarget || 1;
          const isCompleted = currentCount >= targetCount;

          return (
            <div
              key={doa.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition space-y-4"
            >
              {/* Header card */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {doa.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-1">{doa.title}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(doa)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition"
                    title="Salin doa"
                  >
                    {copiedId === doa.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <div className="py-2 text-right">
                <p className="font-quran text-2xl sm:text-3xl font-bold text-slate-900 leading-loose">
                  {doa.arabic}
                </p>
              </div>

              {/* Transliteration */}
              {doa.transliteration && (
                <div className="p-3 bg-emerald-50/40 border border-emerald-100/70 rounded-2xl text-xs text-emerald-950 font-medium italic">
                  {doa.transliteration}
                </div>
              )}

              {/* Translation */}
              <div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  "{doa.translation}"
                </p>
                <p className="text-[11px] text-slate-400 font-semibold mt-2">
                  Referensi: {doa.reference}
                </p>
              </div>

              {/* Tasbih Digital Counter if target > 1 */}
              {targetCount > 1 && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleIncrement(doa)}
                      disabled={isCompleted}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer'
                      }`}
                    >
                      <span>{isCompleted ? 'Selesai Dibaca' : 'Hitung Dzikir'}</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-mono">
                        {currentCount} / {targetCount}
                      </span>
                    </button>

                    {currentCount > 0 && (
                      <button
                        onClick={() => handleResetCounter(doa.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition"
                        title="Ulangi hitungan"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Target sunnah: {targetCount} kali
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
