import React, { useState } from 'react';
import { useAppStore } from '@/services/store/appStore';
import { UserProfile, MembershipStatus, UserRole } from '@/types';
import {
  Users,
  Search,
  UserPlus,
  Check,
  X,
  Edit2,
  Trash2,
  ShieldCheck,
  UserCheck,
  Clock,
  Filter
} from 'lucide-react';
import { formatShortDate } from '@/utils/formatters';

export const AdminMembersPage: React.FC = () => {
  const { allUsers, approveMember, rejectMember, updateUserProfile, deleteMember } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form for adding new member
  const [newMember, setNewMember] = useState({
    fullName: '',
    email: '',
    nim: '',
    phoneNumber: '',
    programStudi: 'Pendidikan Agama Islam',
    angkatan: '2024',
    role: 'member' as UserRole
  });

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.membershipStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.fullName || !newMember.email || !newMember.nim) {
      alert('Harap lengkapi semua kolom wajib.');
      return;
    }
    const createdUid = `user-${Date.now()}`;
    const newUser: UserProfile = {
      ...newMember,
      uid: createdUid,
      membershipStatus: 'approved',
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newMember.fullName)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    updateUserProfile(createdUid, newUser);
    setShowAddModal(false);
    alert('Anggota baru berhasil ditambahkan.');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserProfile(editingUser.uid, editingUser);
    setEditingUser(null);
    alert('Data anggota berhasil diperbarui.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Anggota
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen verifikasi akun, program studi, status keanggotaan, dan hak akses
          </p>
        </div>

        {/* Tambah Anggota Button (Matching screenshot) */}
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah Anggota</span>
        </button>
      </div>

      {/* Search & Filter Bar (Matching screenshot: Cari nama atau NIM...) */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau NIM..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl shrink-0">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === st
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st === 'all'
                ? 'Semua'
                : st === 'approved'
                ? 'Aktif'
                : st === 'pending'
                ? 'Menunggu'
                : 'Ditolak'}
            </button>
          ))}
        </div>
      </div>

      {/* Member Cards List (Matching reference screenshot) */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredUsers.map((user) => {
          const isPending = user.membershipStatus === 'pending';

          return (
            <div
              key={user.uid}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-emerald-50/30 transition"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900">{user.fullName}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    NIM: <strong className="font-semibold text-slate-700">{user.nim}</strong> • {user.programStudi} ({user.angkatan})
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {user.email} • WA: {user.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveMember(user.uid)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui</span>
                    </button>
                    <button
                      onClick={() => rejectMember(user.uid)}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  </div>
                ) : (
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      user.membershipStatus === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {user.membershipStatus === 'approved' ? 'Terverifikasi' : 'Ditolak'}
                  </span>
                )}

                {/* Edit Button matching screenshot */}
                <button
                  onClick={() => setEditingUser(user)}
                  className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  title="Edit data anggota"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete Member Button */}
                <button
                  onClick={async () => {
                    if (
                      confirm(
                        `Apakah Anda yakin ingin menghapus anggota "${user.fullName}" (${user.nim})?\nSemua data keanggotaan ini akan dihapus secara permanen.`
                      )
                    ) {
                      await deleteMember(user.uid);
                      alert(`Anggota ${user.fullName} berhasil dihapus.`);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                  title="Hapus data anggota"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Member */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">Tambah Anggota Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newMember.fullName}
                  onChange={(e) => setNewMember({ ...newMember, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email UNINUS</label>
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIM</label>
                  <input
                    type="text"
                    required
                    value={newMember.nim}
                    onChange={(e) => setNewMember({ ...newMember, nim: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={newMember.phoneNumber}
                    onChange={(e) => setNewMember({ ...newMember, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Program Studi</label>
                <input
                  type="text"
                  required
                  value={newMember.programStudi}
                  onChange={(e) => setNewMember({ ...newMember, programStudi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Angkatan</label>
                  <select
                    value={newMember.angkatan}
                    onChange={(e) => setNewMember({ ...newMember, angkatan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {['2022', '2023', '2024', '2025', '2026'].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Akun</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold text-emerald-800"
                  >
                    <option value="member">Anggota</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Simpan Anggota
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Member */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">Ubah Data Anggota</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peran (Role)</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-emerald-800"
                  >
                    <option value="member">Anggota</option>
                    <option value="admin">Admin / Pembimbing</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Keanggotaan</label>
                  <select
                    value={editingUser.membershipStatus}
                    onChange={(e) => setEditingUser({ ...editingUser, membershipStatus: e.target.value as MembershipStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="approved">Aktif (Approved)</option>
                    <option value="pending">Menunggu (Pending)</option>
                    <option value="rejected">Ditolak (Rejected)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Program Studi</label>
                <input
                  type="text"
                  value={editingUser.programStudi}
                  onChange={(e) => setEditingUser({ ...editingUser, programStudi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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
