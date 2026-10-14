import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/services/store/appStore';
import {
  Wifi,
  WifiOff,
  ShieldCheck,
  Menu,
  X,
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
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Users,
  Megaphone,
  BarChart3,
  Settings
} from 'lucide-react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { currentUser, isAdmin, isOnline, logout } = useAppStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
      setIsDrawerOpen(false);
      await logout();
      navigate('/login');
    }
  };

  const memberMenus = [
    { to: '/', label: 'Beranda', icon: Home, end: true },
    { to: '/quran', label: 'Al-Qur’an Digital (114 Surah)', icon: BookOpen },
    { to: '/setor-hafalan', label: 'Setor Hafalan', icon: Award },
    { to: '/talaqqi', label: 'Talaqqi & Murojaah', icon: Mic },
    { to: '/progres-hafalan', label: 'Progress Hafalan', icon: TrendingUp },
    { to: '/infaq', label: 'Infaq & Shadaqah', icon: HeartHandshake },
    { to: '/kegiatan', label: 'Jadwal & Kegiatan', icon: Calendar },
    { to: '/absensi', label: 'Absensi Anggota', icon: QrCode },
    { to: '/doa-dzikir', label: 'Doa & Dzikir Harian', icon: Sparkles },
    { to: '/profil', label: 'Profil Saya', icon: User }
  ];

  const adminMenus = [
    { to: '/admin', label: 'Dashboard Ringkasan', icon: LayoutDashboard, end: true },
    { to: '/admin/anggota', label: 'Kelola Anggota', icon: Users },
    { to: '/admin/setoran', label: 'Kelola Setoran Hafalan', icon: Award },
    { to: '/admin/kegiatan', label: 'Kelola Kegiatan', icon: Calendar },
    { to: '/admin/absensi', label: 'Sesi Absensi & QR', icon: QrCode },
    { to: '/admin/infaq', label: 'Kelola Infaq & Shadaqah', icon: HeartHandshake },
    { to: '/admin/pengumuman', label: 'Informasi & Pengumuman', icon: Megaphone },
    { to: '/admin/laporan', label: 'Laporan & Statistik', icon: BarChart3 },
    { to: '/admin/pengaturan', label: 'Pengaturan & Firebase', icon: Settings }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100/90 shadow-xs pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger Toggle Button for Mobile / Android */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 -ml-2 rounded-xl text-emerald-950 hover:bg-emerald-100/70 active:bg-emerald-200/80 transition md:hidden cursor-pointer"
              aria-label="Buka Menu Navigasi"
              title="Buka Menu"
            >
              <Menu className="w-5 h-5 text-emerald-900" />
            </button>

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
          </div>

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
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portal Admin</span>
                <span className="sm:hidden text-[11px]">Admin</span>
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
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-xl transition shadow-xs"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Buka Tutup Menu Samping untuk HP / Android) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Slide-Over Content */}
          <div className="relative w-[85%] max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-white shadow-xs p-1 border border-emerald-200 flex items-center justify-center">
                  <img src="/logo.png" alt="IQ UNINUS" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-emerald-950">IQ UNINUS</h3>
                  <p className="text-[10px] text-emerald-700">Ikraamul Qur’an UNINUS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-200/60 transition cursor-pointer"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card */}
            {currentUser ? (
              <div className="p-4 bg-gradient-to-br from-emerald-800 to-teal-900 text-white">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
                    alt={currentUser.fullName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-300/40"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs truncate">{currentUser.fullName}</p>
                    <p className="text-[10px] text-emerald-200 truncate">NIM: {currentUser.nim}</p>
                    <span className="inline-block mt-0.5 text-[9px] font-semibold uppercase bg-emerald-700/80 text-emerald-100 px-1.5 py-0.2 rounded-full">
                      {currentUser.role === 'admin' ? 'Administrator' : 'Anggota'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border-b border-emerald-100">
                <Link
                  to="/login"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center block shadow-xs"
                >
                  Masuk ke Akun
                </Link>
              </div>
            )}

            {/* Nav Menu Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Member Nav Links */}
              <div>
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Menu Utama
                </p>
                <div className="space-y-1">
                  {memberMenus.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setIsDrawerOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                              : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className="flex items-center gap-2.5">
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
              </div>

              {/* Admin Links if user is admin */}
              {isAdmin && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-purple-700 mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Panel Administrator</span>
                  </p>
                  <div className="space-y-1">
                    {adminMenus.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          end={item.end}
                          onClick={() => setIsDrawerOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                              isActive
                                ? 'bg-purple-700 text-white shadow-xs font-semibold'
                                : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
                            }`
                          }
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-purple-600" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer with Logout */}
            {currentUser && (
              <div className="p-3 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

