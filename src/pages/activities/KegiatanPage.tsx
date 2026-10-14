import React, { useState } from 'react';
import { useAppStore } from '@/services/store/appStore';
import { Activity } from '@/types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Share2,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { formatDateTime, formatShortDate } from '@/utils/formatters';

export const KegiatanPage: React.FC = () => {
  const { activities, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'mendatang' | 'selesai'>('mendatang');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  const filteredActivities = activities.filter((act) => {
    if (activeTab === 'mendatang') {
      return act.status === 'akan_datang' || act.status === 'berlangsung';
    } else {
      return act.status === 'selesai' || act.status === 'dibatalkan';
    }
  });

  const handleRegister = (actId: string) => {
    if (!currentUser) {
      alert('Harap masuk terlebih dahulu untuk mendaftar kegiatan.');
      return;
    }
    if (registeredIds.includes(actId)) {
      alert('Anda sudah terdaftar pada kegiatan ini.');
      return;
    }
    setRegisteredIds([...registeredIds, actId]);
    alert('Pendaftaran berhasil! Silakan hadir tepat waktu sesuai jadwal.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Jadwal & Informasi Kegiatan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Agenda kajian, bimbingan tahfidz, seminar, dan kegiatan dakwah UNINUS
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      {/* Tabs (Matching screenshot: Mendatang / Selesai) */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-xs mx-auto">
        <button
          onClick={() => setActiveTab('mendatang')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'mendatang'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Mendatang
        </button>
        <button
          onClick={() => setActiveTab('selesai')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'selesai'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Selesai
        </button>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.map((act) => {
          const isRegistered = registeredIds.includes(act.id);

          return (
            <div
              key={act.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition space-y-4"
            >
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {act.category}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {formatShortDate(act.startAt)}
                </span>
              </div>

              {/* Title and Description */}
              <div>
                <h3
                  onClick={() => setSelectedActivity(act)}
                  className="font-extrabold text-base text-slate-900 hover:text-emerald-700 cursor-pointer transition"
                >
                  {act.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                  {act.description}
                </p>
              </div>

              {/* Meta details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formatDateTime(act.startAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{act.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>
                    Kuota: {act.registeredCount} / {act.capacity} Peserta
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedActivity(act)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
                  >
                    Buka Detail
                  </button>

                  {act.registrationEnabled && (
                    <button
                      onClick={() => handleRegister(act.id)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                        isRegistered
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {isRegistered ? 'Terdaftar ✓' : 'Daftar Sekarang'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredActivities.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-3xl p-6 border border-slate-200">
            <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">Tidak ada kegiatan pada kategori ini.</p>
          </div>
        )}
      </div>

      {/* Detail Activity Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {selectedActivity.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {selectedActivity.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedActivity.posterURL && (
              <img
                src={selectedActivity.posterURL}
                alt={selectedActivity.title}
                className="w-full h-44 object-cover rounded-2xl"
              />
            )}

            <div className="space-y-2 text-xs text-slate-600">
              <p className="leading-relaxed">{selectedActivity.description}</p>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Waktu: {formatDateTime(selectedActivity.startAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Lokasi: {selectedActivity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kapasitas: {selectedActivity.capacity} Peserta</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  handleRegister(selectedActivity.id);
                  setSelectedActivity(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Daftar Kegiatan Ini
              </button>
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
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
