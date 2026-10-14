import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/services/store/appStore';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { isLoggedIn, currentUser } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 via-emerald-900 to-teal-950 text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Islamic Watermark Pattern */}
      <div className="absolute inset-0 bg-pattern-dark opacity-30 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 flex justify-between items-center pt-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-200/90 bg-emerald-700/50 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
          Universitas Islam Nusantara
        </span>
        <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> PWA Official
        </span>
      </div>

      {/* Center Branding matching the official mockups */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto py-8">
        <div className="relative mb-6">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-white p-4 shadow-2xl flex items-center justify-center border-2 border-emerald-400/40 transform transition hover:scale-105 duration-300">
            <img
              src="/logo.png"
              alt="Logo Resmi Ikraamul Qur'an UNINUS"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -bottom-2 bg-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md">
            EST. UNINUS
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          IKRAAMUL QUR’AN
        </h1>
        <p className="text-sm font-semibold text-emerald-300 tracking-wider uppercase mb-3">
          Lembaga Tahfidz & Dakwah UNINUS
        </p>

        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xs font-normal leading-relaxed italic mb-6">
          “Bersama Al-Qur’an, Menuju Pribadi yang Lebih Baik”
        </p>

        {/* Subtle Mosque Silhouette Graphic */}
        <div className="w-full max-w-xs h-16 flex items-center justify-center opacity-60">
          <svg viewBox="0 0 500 120" className="w-full h-full fill-emerald-400/30">
            <path d="M250,10 C240,40 230,50 210,60 L210,120 L290,120 L290,60 C270,50 260,40 250,10 Z M250,0 C252,5 252,10 250,10 Z M180,40 C175,60 160,70 150,75 L150,120 L200,120 L200,75 C190,70 185,60 180,40 Z M320,40 C315,60 300,70 290,75 L290,120 L340,120 L340,75 C330,70 325,60 320,40 Z M120,60 L120,120 L140,120 L140,60 Z M360,60 L360,120 L380,120 L380,60 Z" />
          </svg>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-10 w-full max-w-sm mx-auto space-y-3 pb-6">
        {isLoggedIn ? (
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
          >
            <span>Lanjutkan sebagai {currentUser?.fullName.split(' ')[0]}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <span>Masuk Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-medium rounded-2xl border border-white/20 backdrop-blur-md transition text-xs"
            >
              Daftar Anggota Baru
            </button>
          </>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full text-center text-xs text-emerald-300 hover:text-white transition py-1"
        >
          Masuk sebagai Tamu (Lihat Beranda & Al-Qur'an)
        </button>
      </div>
    </div>
  );
};
