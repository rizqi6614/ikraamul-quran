import React from 'react';
import { useAppStore } from '@/services/store/appStore';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useAppStore();

  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-sm sticky top-16 z-30 animate-in fade-in slide-in-from-top-1">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        Perangkat Anda sedang offline. Anda tetap dapat membaca Al-Qur'an dan doa yang tersimpan. Pengiriman setoran, infaq, atau absensi memerlukan koneksi internet.
      </span>
    </div>
  );
};
