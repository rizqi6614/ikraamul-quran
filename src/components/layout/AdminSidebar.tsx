import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Award,
  BookOpen,
  Calendar,
  Megaphone,
  QrCode,
  HeartHandshake,
  BarChart3,
  Settings,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { useAppStore } from '@/services/store/appStore';

export const AdminSidebar: React.FC = () => {
  const { currentUser, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar dari panel admin?')) {
      await logout();
      navigate('/login');
    }
  };

  const adminNav = [
    { to: '/admin', label: 'Dashboard Ringkasan', icon: LayoutDashboard, end: true },
    { to: '/admin/anggota', label: 'Kelola Anggota', icon: Users },
    { to: '/admin/setoran', label: 'Kelola Setoran Hafalan', icon: Award },
    { to: '/admin/kegiatan', label: 'Jadwal & Kegiatan', icon: Calendar },
    { to: '/admin/absensi', label: 'Sesi Absensi & QR', icon: QrCode },
    { to: '/admin/infaq', label: 'Kelola Infaq & Shadaqah', icon: HeartHandshake },
    { to: '/admin/pengumuman', label: 'Informasi & Pengumuman', icon: Megaphone },
    { to: '/admin/laporan', label: 'Laporan & Statistik', icon: BarChart3 },
    { to: '/admin/pengaturan', label: 'Pengaturan & Firebase', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col shrink-0">
      {/* Admin header */}
      <div className="mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>PORTAL ADMINISTRATOR</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 truncate">{currentUser?.fullName}</p>
      </div>

      {/* Nav Links */}
      <div className="space-y-1 flex-1">
        {adminNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Return to member view & Logout */}
      <div className="pt-4 border-t border-slate-800 mt-4 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Kembali ke Beranda Anggota</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 p-2.5 rounded-xl text-rose-400 hover:bg-rose-950/40 text-xs font-medium transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Keluar Akun Admin</span>
        </button>
      </div>
    </aside>
  );
};
