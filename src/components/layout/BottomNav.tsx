import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Award, BookOpen, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Beranda', icon: Home, end: true },
    { to: '/kegiatan', label: 'Kegiatan', icon: Calendar },
    { to: '/setor-hafalan', label: 'Hafalan', icon: Award },
    { to: '/quran', label: 'Al-Qur’an', icon: BookOpen },
    { to: '/profil', label: 'Profil', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 shadow-lg pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-colors duration-150 ${
                  isActive
                    ? 'text-emerald-700 font-bold'
                    : 'text-slate-400 hover:text-emerald-600 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`relative p-1 rounded-xl transition-all duration-200 ${
                      isActive ? 'bg-emerald-100/70 text-emerald-800 scale-105' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 1.8} />
                  </div>
                  <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
