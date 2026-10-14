import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Award,
  Mic,
  TrendingUp,
  HeartHandshake,
  Calendar,
  QrCode,
  Sparkles,
  User,
  ShieldCheck,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAppStore } from '@/services/store/appStore';

export const DesktopSidebar: React.FC = () => {
  const { currentUser, isAdmin, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
      await logout();
      navigate('/login');
    }
  };

  const menuItems = [
    { to: '/', label: 'Beranda', icon: Home, end: true },
    { to: '/quran', label: 'Al-Qur’an Digital', icon: BookOpen },
    { to: '/setor-hafalan', label: 'Setor Hafalan', icon: Award },
    { to: '/talaqqi', label: 'Talaqqi & Murojaah', icon: Mic },
    { to: '/progres-hafalan', label: 'Progress Hafalan', icon: TrendingUp },
    { to: '/infaq', label: 'Infaq & Shadaqah', icon: HeartHandshake },
    { to: '/kegiatan', label: 'Jadwal & Kegiatan', icon: Calendar },
    { to: '/absensi', label: 'Absensi Anggota', icon: QrCode },
    { to: '/doa-dzikir', label: 'Doa & Dzikir Harian', icon: Sparkles },
    { to: '/profil', label: 'Profil Saya', icon: User }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-emerald-100 min-h-[calc(100vh-4rem)] p-4 shrink-0">
      {/* User Card */}
      {currentUser && (
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-2xl p-3.5 text-white shadow-md mb-6 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <img
              src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
              alt={currentUser.fullName}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-300/40"
            />
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{currentUser.fullName}</p>
              <p className="text-[11px] text-emerald-200 truncate">NIM: {currentUser.nim}</p>
              <span className="inline-block mt-1 text-[10px] font-semibold uppercase bg-emerald-700/80 text-emerald-100 px-2 py-0.5 rounded-full">
                {currentUser.role === 'admin' ? 'Administrator' : 'Anggota Aktif'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Nav Menu Items */}
      <div className="space-y-1 flex-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Menu Utama
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Admin Panel Button if admin */}
      {isAdmin && (
        <div className="pt-3 border-t border-emerald-100 mt-2">
          <NavLink
            to="/admin"
            className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 transition text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>Panel Administrator</span>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-600" />
          </NavLink>
        </div>
      )}

      {/* Logout button */}
      <div className="pt-2 mt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
};
