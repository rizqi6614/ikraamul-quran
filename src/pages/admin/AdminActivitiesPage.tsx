import React, { useState } from 'react';
import { useAppStore } from '@/services/store/appStore';
import { Activity, ActivityCategory, ActivityStatus } from '@/types';
import { Calendar, Plus, Edit2, Trash2, MapPin, Clock, Users, X } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

export const AdminActivitiesPage: React.FC = () => {
  const { activities, createActivity, updateActivity, deleteActivity, currentUser } = useAppStore();

  const [showModal, setShowModal] = useState(false);
  const [editingAct, setEditingAct] = useState<Activity | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Kajian' as ActivityCategory,
    startAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    endAt: new Date(Date.now() + 93600000).toISOString().slice(0, 16),
    location: 'Aula UNINUS',
    registrationEnabled: true,
    capacity: 50,
    status: 'akan_datang' as ActivityStatus
  });

  const categories: ActivityCategory[] = [
    'Kajian',
    'Tahfidz',
    'Murojaah',
    'Pelatihan',
    'Kegiatan Sosial',
    'Rapat Organisasi',
    'Kegiatan Umum'
  ];

  const handleOpenCreate = () => {
    setEditingAct(null);
    setForm({
      title: '',
      description: '',
      category: 'Kajian',
      startAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      endAt: new Date(Date.now() + 93600000).toISOString().slice(0, 16),
      location: 'Aula UNINUS',
      registrationEnabled: true,
      capacity: 50,
      status: 'akan_datang'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (act: Activity) => {
    setEditingAct(act);
    setForm({
      title: act.title,
      description: act.description,
      category: act.category,
      startAt: act.startAt.slice(0, 16),
      endAt: act.endAt.slice(0, 16),
      location: act.location,
      registrationEnabled: act.registrationEnabled,
      capacity: act.capacity,
      status: act.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAct) {
      await updateActivity(editingAct.id, {
        ...form,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString()
      });
      alert('Kegiatan berhasil diperbarui!');
    } else {
      await createActivity({
        ...form,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        createdBy: currentUser?.uid || 'admin'
      });
      alert('Kegiatan baru berhasil dibuat!');
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string, title?: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kegiatan "${title || 'ini'}"?`)) {
      await deleteActivity(id);
      alert('Kegiatan berhasil dihapus dari database.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Jadwal & Kegiatan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Buat jadwal kajian, perlombaan tahfidz, dan pertemuan anggota
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Kegiatan Baru</span>
        </button>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {act.category}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {act.status}
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 mt-2">{act.title}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{act.description}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{formatDateTime(act.startAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{act.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Peserta: {act.registeredCount} / {act.capacity} Kuota</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(act)}
                className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition"
                title="Edit kegiatan"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(act.id, act.title)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                title="Hapus kegiatan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Activity */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingAct ? 'Ubah Informasi Kegiatan' : 'Buat Kegiatan Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi</label>
                <textarea
                  rows={2}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-emerald-800"
                  >
                    <option value="akan_datang">Akan Datang</option>
                    <option value="berlangsung">Berlangsung</option>
                    <option value="selesai">Selesai</option>
                    <option value="dibatalkan">Dibatalkan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Mulai</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.startAt}
                    onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Selesai</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.endAt}
                    onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Kegiatan</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Aula UNINUS Lt. 3"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kapasitas Maksimal Peserta</label>
                <input
                  type="number"
                  min="5"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 30 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  {editingAct ? 'Simpan Perubahan' : 'Buat Kegiatan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
