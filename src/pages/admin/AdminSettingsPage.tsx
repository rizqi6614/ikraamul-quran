import React, { useState } from 'react';
import { useAppStore } from '@/services/store/appStore';
import { getFirebaseConfig, isFirebaseConfigured } from '@/services/firebase/config';
import {
  Settings,
  Database,
  ShieldCheck,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Globe,
  Sliders
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { isFirebaseLive, resetAllDataToDefault } = useAppStore();

  const currentConfig = getFirebaseConfig();

  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [projectId, setProjectId] = useState(currentConfig.projectId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(currentConfig.appId || '');

  const [requireVerification, setRequireVerification] = useState(true);
  const [openRegistration, setOpenRegistration] = useState(true);

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const configObj = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    };

    localStorage.setItem('iq_firebase_config_override', JSON.stringify(configObj));
    alert('Konfigurasi Firebase berhasil disimpan! Halaman akan dimuat ulang untuk menginisialisasi koneksi.');
    window.location.reload();
  };

  const handleResetData = () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mengatur ulang data aplikasi ke data bawaan demo awal? Seluruh perubahan lokal akan dikembalikan.')) {
      resetAllDataToDefault();
      alert('Data berhasil direset ke kondisi awal!');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pengaturan Aplikasi & Firebase
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi database Cloud Firestore, Firebase Authentication, dan parameter sistem
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 ${
              isFirebaseConfigured()
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">Status Koneksi Firebase</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isFirebaseConfigured()
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isFirebaseConfigured() ? 'Firebase Live Connected' : 'Reactive Local-First Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isFirebaseConfigured()
                ? `Terhubung ke Project ID: ${projectId}`
                : 'Aplikasi berjalan dalam mode penyimpanan lokal interaktif berkinerja tinggi.'}
            </p>
          </div>
        </div>
      </div>

      {/* Firebase Credentials Configuration Form */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Database className="w-4 h-4 text-emerald-600" />
          <h3 className="font-extrabold text-sm text-slate-900">
            Kredensial Firebase Web SDK
          </h3>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Anda dapat memasukkan kredensial dari Firebase Console (Project Settings &rarr; General &rarr; Your Apps &rarr; Web App SDK configuration) di bawah ini atau melalui file <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800">.env</code>.
        </p>

        <form onSubmit={handleSaveFirebaseConfig} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">API Key</label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Project ID</label>
              <input
                type="text"
                placeholder="iq-uninus-app"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Auth Domain</label>
              <input
                type="text"
                placeholder="iq-uninus-app.firebaseapp.com"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Storage Bucket</label>
              <input
                type="text"
                placeholder="iq-uninus-app.appspot.com"
                value={storageBucket}
                onChange={(e) => setStorageBucket(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Messaging Sender ID</label>
              <input
                type="text"
                placeholder="1092837465"
                value={messagingSenderId}
                onChange={(e) => setMessagingSenderId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">App ID</label>
              <input
                type="text"
                placeholder="1:1092837465:web:..."
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan & Terapkan Konfigurasi Firebase</span>
          </button>
        </form>
      </div>

      {/* Feature Flags & Safety Controls */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <h3 className="font-extrabold text-sm text-slate-900">Pengaturan Sistem Organisasi</h3>
        </div>

        <div className="space-y-3 text-xs text-slate-700">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">Pendaftaran Anggota Terbuka</p>
              <p className="text-[11px] text-slate-500">
                Izinkan mahasiswa UNINUS mendaftar melalui formulir registrasi
              </p>
            </div>
            <input
              type="checkbox"
              checked={openRegistration}
              onChange={() => setOpenRegistration(!openRegistration)}
              className="accent-emerald-600 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">Wajib Persetujuan Verifikasi Admin</p>
              <p className="text-[11px] text-slate-500">
                Akun baru harus disahkan admin sebelum dapat menyetor hafalan & absensi
              </p>
            </div>
            <input
              type="checkbox"
              checked={requireVerification}
              onChange={() => setRequireVerification(!requireVerification)}
              className="accent-emerald-600 w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>Zona Pemulihan Data Uji Coba</span>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Jika Anda ingin mengembalikan seluruh akun, setoran hafalan, infaq, dan kegiatan ke kondisi contoh awal (seperti yang ada di mockup desain resmi), gunakan tombol reset di bawah.
        </p>
        <button
          onClick={handleResetData}
          className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Semua Data ke Kondisi Awal</span>
        </button>
      </div>
    </div>
  );
};
