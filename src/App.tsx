import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppStoreProvider, useAppStore } from '@/services/store/appStore';
import { AppLayout } from '@/components/layout/AppLayout';

// Auth Pages
import { SplashScreen } from '@/pages/auth/SplashScreen';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Member Pages
import { DashboardPage } from '@/pages/member/DashboardPage';
import { QuranListPage } from '@/pages/quran/QuranListPage';
import { QuranDetailPage } from '@/pages/quran/QuranDetailPage';
import { SetorHafalanPage } from '@/pages/tahfidz/SetorHafalanPage';
import { TalaqqiPage } from '@/pages/tahfidz/TalaqqiPage';
import { ProgressHafalanPage } from '@/pages/tahfidz/ProgressHafalanPage';
import { DoaDzikirPage } from '@/pages/member/DoaDzikirPage';
import { InfaqPage } from '@/pages/donations/InfaqPage';
import { KegiatanPage } from '@/pages/activities/KegiatanPage';
import { AbsensiPage } from '@/pages/attendance/AbsensiPage';
import { ProfilePage } from '@/pages/member/ProfilePage';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminMembersPage } from '@/pages/admin/AdminMembersPage';
import { AdminSubmissionsPage } from '@/pages/admin/AdminSubmissionsPage';
import { AdminActivitiesPage } from '@/pages/admin/AdminActivitiesPage';
import { AdminAttendancePage } from '@/pages/admin/AdminAttendancePage';
import { AdminDonationsPage } from '@/pages/admin/AdminDonationsPage';
import { AdminAnnouncementsPage } from '@/pages/admin/AdminAnnouncementsPage';
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

// Route Guard: Redirects to /login if not logged in
function AuthGuard({ children }: { children: React.ReactElement }) {
  const { isLoggedIn } = useAppStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Public Route Guard: If already logged in, redirect to home / admin
function PublicAuthRoute({ children }: { children: React.ReactElement }) {
  const { isLoggedIn, isAdmin } = useAppStore();

  if (isLoggedIn) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }
  return children;
}

export function App() {
  return (
    <AppStoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes (First view when unauthenticated is /login) */}
          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <LoginPage />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicAuthRoute>
                <RegisterPage />
              </PublicAuthRoute>
            }
          />
          <Route path="/splash" element={<SplashScreen />} />

          {/* Protected Main App Layout (Must be authenticated to view) */}
          <Route
            element={
              <AuthGuard>
                <AppLayout />
              </AuthGuard>
            }
          >
            {/* Member Routes */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/quran" element={<QuranListPage />} />
            <Route path="/quran/:surahId" element={<QuranDetailPage />} />
            <Route path="/setor-hafalan" element={<SetorHafalanPage />} />
            <Route path="/talaqqi" element={<TalaqqiPage />} />
            <Route path="/progres-hafalan" element={<ProgressHafalanPage />} />
            <Route path="/doa-dzikir" element={<DoaDzikirPage />} />
            <Route path="/infaq" element={<InfaqPage />} />
            <Route path="/kegiatan" element={<KegiatanPage />} />
            <Route path="/absensi" element={<AbsensiPage />} />
            <Route path="/profil" element={<ProfilePage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/anggota" element={<AdminMembersPage />} />
            <Route path="/admin/setoran" element={<AdminSubmissionsPage />} />
            <Route path="/admin/kegiatan" element={<AdminActivitiesPage />} />
            <Route path="/admin/absensi" element={<AdminAttendancePage />} />
            <Route path="/admin/infaq" element={<AdminDonationsPage />} />
            <Route path="/admin/pengumuman" element={<AdminAnnouncementsPage />} />
            <Route path="/admin/laporan" element={<AdminReportsPage />} />
            <Route path="/admin/pengaturan" element={<AdminSettingsPage />} />
          </Route>

          {/* Catch-all redirect to root (which redirects to /login if not authenticated) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppStoreProvider>
  );
}

export default App;
