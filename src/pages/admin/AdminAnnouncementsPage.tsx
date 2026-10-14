import React, { useState } from 'react';
import { useAppStore } from '@/services/store/appStore';
import { Megaphone, Plus, Trash2, CheckCircle, Clock, X } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

export const AdminAnnouncementsPage: React.FC = () => {
  const { announcements, createAnnouncement, currentUser } = useAppStore();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Pengumuman',
    published: true,
    publishedAt: new Date().toISOString()
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAnnouncement({
      ...form,
      createdBy: currentUser?.uid || 'admin'
    });
    setShowModal(false);
    setForm({
      title: '',
      content: '',
      category: 'Pengumuman',
      published: true,
      publishedAt: new Date().toISOString()
    });
    alert('Pengumuman baru berhasil dipublikasikan ke seluruh santri dan anggota.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Informasi & Pengumuman Organisasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Publikasikan siaran resmi kepada seluruh anggota Ikraamul Qur’an UNINUS
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Pengumuman</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {ann.category}
              </span>
              <span className="text-[11px] text-slate-400">
                {formatDateTime(ann.publishedAt)}
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">{ann.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
          </div>
        ))}
      </div>

      {/* Modal Announcement */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">Buat Pengumuman Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Penyesuaian Jadwal Murojaah Pekan Ini"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="Pengumuman">Pengumuman Resmi</option>
                  <option value="Info">Informasi Kegiatan</option>
                  <option value="Tahfidz">Tahfidz & Ujian</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Berita</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan isi pengumuman lengkap..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Siarkan Pengumuman
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
