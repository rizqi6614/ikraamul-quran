import React from 'react';
import { useAppStore } from '@/services/store/appStore';
import { Wifi, WifiOff, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { currentUser, isAdmin, isOnline } = useAppStore();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100/80 shadow-xs pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white shadow-xs p-1 border border-emerald-100 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="IQ UNINUS Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-sm sm:text-lg text-emerald-950 tracking-tight leading-none">
                IQ UNINUS
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                PWA
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-medium hidden sm:block">
              Ikraamul Qur’an UNINUS
            </p>
          </div>
        </Link>

        {/* Right Action Icons & User Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Online/Offline status badge */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title={isOnline ? 'Terhubung secara online' : 'Mode offline aktif'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
            <span className="hidden md:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </div>



          {/* Admin link badge if admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard Admin</span>
              <span className="sm:hidden">Admin</span>
            </Link>
          )}

          {/* User Profile Mini Button */}
          {currentUser ? (
            <Link
              to="/profil"
              className="flex items-center gap-2 p-1 rounded-full hover:bg-emerald-50 transition border border-transparent hover:border-emerald-200"
            >
              <img
                src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl transition"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
