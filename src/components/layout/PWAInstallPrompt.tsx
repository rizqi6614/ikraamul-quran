import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user has dismissed prompt previously
      const dismissed = localStorage.getItem('iq_pwa_dismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Untuk memasang di perangkat Anda: Buka menu browser (ikon titik 3 atau tombol Share), lalu pilih "Tambahkan ke Layar Utama" / "Add to Home Screen".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('iq_pwa_dismissed', 'true');
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 bg-white rounded-2xl shadow-2xl border border-emerald-200 p-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 p-1 flex items-center justify-center shrink-0">
          <img src="/logo.png" alt="IQ UNINUS Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 pr-6">
          <h4 className="font-bold text-sm text-emerald-950">Pasang IQ UNINUS</h4>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Pasang aplikasi ke layar utama ponsel/laptop untuk akses cepat, Al-Qur'an offline, dan notifikasi kegiatan.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang Sekarang</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium transition"
            >
              Nanti Saja
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
