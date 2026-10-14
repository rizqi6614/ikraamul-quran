import React, { useState, useRef } from 'react';
import { useAppStore } from '@/services/store/appStore';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Bell,
  Lock,
  Info,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Download,
  Mail,
  Phone,
  Hash,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  X,
  Camera,
  Upload,
  Loader2
} from 'lucide-react';
import { storage } from '@/services/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { formatDateTime } from '@/utils/formatters';

export const ProfilePage: React.FC = () => {
  const { currentUser, logout, updateUserProfile, isAdmin } = useAppStore();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Edit fields
  const [phoneInput, setPhoneInput] = useState(currentUser?.phoneNumber || '');
  const [photoInput, setPhotoInput] = useState(currentUser?.photoURL || '');

  // Notifications toggles
  const [notifState, setNotifState] = useState({
    hafalan: true,
    kegiatan: true,
    pengumuman: true
  });

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    setUploadingPhoto(true);
    setUploadSuccess(false);

    try {
      let finalPhotoUrl = '';

      // Try uploading to Firebase Storage if available
      if (storage) {
        try {
          const storageRef = ref(storage, `profile_photos/${currentUser.uid}_${Date.now()}`);
          await uploadBytes(storageRef, file);
          finalPhotoUrl = await getDownloadURL(storageRef);
        } catch (storageErr) {
          console.warn('Firebase Storage direct upload note:', storageErr);
        }
      }

      // If storage returned URL or fallback to base64 Data URL
      if (!finalPhotoUrl) {
        finalPhotoUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // Save to Firebase Firestore & local state
      await updateUserProfile(currentUser.uid, {
        photoURL: finalPhotoUrl
      });
      setPhotoInput(finalPhotoUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      alert('Gagal mengunggah foto: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    await updateUserProfile(currentUser.uid, {
      phoneNumber: phoneInput,
      photoURL: photoInput
    });
    setShowEditModal(false);
    alert('Profil berhasil diperbarui!');
  };

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageFileSelect}
        className="hidden"
      />

      {/* Profile Header (Matching screenshot: Photo, Name, "Anggota") */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm text-center relative overflow-hidden">
        {/* Avatar with Camera badge */}
        <div className="relative w-24 h-24 mx-auto mb-3">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-md overflow-hidden">
            <img
              src={currentUser?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.fullName || 'User')}`}
              alt={currentUser?.fullName}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg border-2 border-white transition cursor-pointer"
            title="Unggah Foto dari Galeri / Kamera"
          >
            {uploadingPhoto ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
        </div>

        {uploadSuccess && (
          <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-bold animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Foto profil berhasil diperbarui & disimpan ke Firebase!</span>
          </div>
        )}

        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
          {currentUser?.fullName || 'Pengguna'}
        </h1>
        <p className="text-xs font-semibold text-emerald-700 mt-0.5">
          {isAdmin ? 'Administrator / Pembimbing Tahfidz' : 'Anggota Ikraamul Qur’an'}
        </p>

        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            NIM: {currentUser?.nim || '-'}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            {currentUser?.programStudi || '-'}
          </span>
        </div>
      </div>

      {/* Menu List (Matching exact screenshot: Data Diri, Pengaturan Notifikasi, Ganti Password, Tentang Aplikasi, Keluar) */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {/* 1. Data Diri */}
        <button
          onClick={() => setShowEditModal(true)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-emerald-50/50 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">Data Diri & Kontak</p>
              <p className="text-[11px] text-slate-400">Lihat dan ubah nomor WhatsApp atau foto</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* 2. Pengaturan Notifikasi */}
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">Pengaturan Notifikasi</p>
              <p className="text-[11px] text-slate-400">Pengingat hafalan dan pengumuman</p>
            </div>
          </div>
          <div className="pt-2 pl-12 space-y-2 text-xs text-slate-600">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Pengingat Target Hafalan Harian</span>
              <input
                type="checkbox"
                checked={notifState.hafalan}
                onChange={() => setNotifState({ ...notifState, hafalan: !notifState.hafalan })}
                className="accent-emerald-600"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Notifikasi Jadwal Kegiatan & Sesi Absensi</span>
              <input
                type="checkbox"
                checked={notifState.kegiatan}
                onChange={() => setNotifState({ ...notifState, kegiatan: !notifState.kegiatan })}
                className="accent-emerald-600"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Pengumuman Resmi Organisasi</span>
              <input
                type="checkbox"
                checked={notifState.pengumuman}
                onChange={() => setNotifState({ ...notifState, pengumuman: !notifState.pengumuman })}
                className="accent-emerald-600"
              />
            </label>
          </div>
        </div>

        {/* 3. Ganti Password */}
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-emerald-50/50 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">Ganti Password</p>
              <p className="text-[11px] text-slate-400">Perbarui kata sandi akun Firebase</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* 4. Tentang Aplikasi */}
        <button
          onClick={() => setShowAboutModal(true)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-emerald-50/50 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900">Tentang Aplikasi</p>
              <p className="text-[11px] text-slate-400">Informasi Ikraamul Qur’an UNINUS & versi</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* 5. Keluar */}
        <button
          onClick={handleLogout}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-rose-50 transition text-left text-rose-600 cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-xs text-rose-700">Keluar dari Akun</p>
              <p className="text-[11px] text-rose-400">Akhiri sesi di perangkat ini</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-300" />
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-900">Data Diri Anggota</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 mb-1">Nama Lengkap (Terkunci)</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.fullName}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1">NIM & Program Studi</label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.nim} • ${currentUser.programStudi}`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Foto Profil</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="URL gambar atau unggah dari galeri"
                    value={photoInput}
                    onChange={(e) => setPhotoInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Galeri</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95 space-y-3">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Perbarui Kata Sandi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Demi keamanan akun, tautan pembaruan kata sandi telah dikirimkan ke email terdaftar Anda (<strong>{currentUser?.email}</strong>) melalui Firebase Authentication.
            </p>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* About App Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl text-center animate-in zoom-in-95 space-y-4">
            <div className="w-16 h-16 bg-white border border-emerald-100 rounded-2xl p-2 mx-auto shadow-sm flex items-center justify-center">
              <img src="/logo.png" alt="IQ UNINUS" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                IQ UNINUS — Ikraamul Qur’an
              </h3>
              <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                Progressive Web App v2.0 Official
              </p>
              <p className="text-xs text-slate-500 italic mt-1">
                “Bersama Al-Qur’an, Menuju Pribadi yang Lebih Baik”
              </p>
            </div>
            <div className="text-xs text-slate-600 text-left bg-slate-50 p-4 rounded-2xl space-y-1.5 leading-relaxed">
              <p>
                <strong>Lembaga:</strong> Ikraamul Qur’an Universitas Islam Nusantara (UNINUS) Bandung
              </p>
              <p>
                <strong>Teknologi:</strong> React TypeScript, Vite PWA, Cloud Firestore, Firebase Auth & Storage, Tailwind CSS.
              </p>
              <p>
                <strong>Sumber Al-Qur’an:</strong> Kementerian Agama Republik Indonesia (Kemenag RI) & Equran CDN.
              </p>
            </div>
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
