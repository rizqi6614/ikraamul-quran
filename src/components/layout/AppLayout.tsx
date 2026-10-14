import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { AdminSidebar } from './AdminSidebar';
import { OfflineBanner } from './OfflineBanner';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { useAppStore } from '@/services/store/appStore';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useAppStore();

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-emerald-50/25 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar />

      {/* Offline Alert if disconnected */}
      <OfflineBanner />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {isAdminRoute ? (
          /* Admin View */
          isAdmin ? (
            <>
              <AdminSidebar />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
                <Outlet />
              </main>
            </>
          ) : (
            /* Protected Admin Notice */
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-xl max-w-md space-y-4">
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">Akses Terbatas Administrator</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Halaman administratif ini hanya dapat diakses oleh akun dengan peran Pembimbing / Admin Ikraamul Qur’an UNINUS yang terverifikasi.
                </p>

                <div className="pt-2">
                  <Link
                    to="/login"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Masuk dengan Akun Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div>
                  <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                    &larr; Kembali ke Beranda Anggota
                  </Link>
                </div>
              </div>
            </div>
          )
        ) : (
          /* Member View */
          <>
            <DesktopSidebar />
            <main className="flex-1 min-w-0 safe-pb md:pb-12">
              <Outlet />
            </main>
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation (only on member view) */}
      {!isAdminRoute && <BottomNav />}

      {/* PWA Installation Banner */}
      <PWAInstallPrompt />
    </div>
  );
};
