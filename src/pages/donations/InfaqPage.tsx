import React, { useState } from 'react';
import { useAppStore } from '@/services/store/appStore';
import {
  HeartHandshake,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  QrCode,
  CreditCard,
  Building,
  Upload,
  Receipt,
  FileText,
  X,
  Copy,
  Check,
  Smartphone
} from 'lucide-react';
import { formatRupiah, formatDateTime, formatShortDate } from '@/utils/formatters';
import { DonationStatus } from '@/types';
import confetti from 'canvas-confetti';

export const InfaqPage: React.FC = () => {
  const {
    donationPrograms,
    donations,
    memberDonations,
    createDonation,
    disbursements,
    currentUser
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'infaq' | 'shadaqah'>('infaq');
  const [showDonateModal, setShowDonateModal] = useState<boolean>(false);
  const [copiedGoPay, setCopiedGoPay] = useState<boolean>(false);

  // Form states
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    donationPrograms[0]?.id || 'prog-01'
  );
  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('50000');
  const [categoryName, setCategoryName] = useState<string>('Infaq - Siswa');
  const [paymentMethod, setPaymentMethod] = useState<'gopay' | 'qris' | 'transfer_bsi'>('gopay');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCopyGoPay = () => {
    navigator.clipboard.writeText('082262855600');
    setCopiedGoPay(true);
    setTimeout(() => setCopiedGoPay(false), 2500);
  };
  const [successNotice, setSuccessNotice] = useState<boolean>(false);

  const totalCollectedAll = donationPrograms.reduce((acc, p) => acc + p.collectedAmount, 0);

  const presetAmounts = [10000, 25000, 50000, 75000, 100000, 250000];

  const handlePresetSelect = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Harap masuk terlebih dahulu.');
      return;
    }
    if (amount < 5000) {
      alert('Nominal minimal adalah Rp 5.000.');
      return;
    }

    setIsSubmitting(true);
    const prog = donationPrograms.find((p) => p.id === selectedProgramId) || donationPrograms[0];

    await createDonation({
      memberId: currentUser.uid,
      programId: prog.id,
      programTitle: prog.title,
      category: categoryName,
      amount,
      paymentMethod,
      paymentReference: `INV-IQ-${Date.now().toString().slice(-8)}`,
      notes,
      proofURL: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400'
    });

    setIsSubmitting(false);
    setShowDonateModal(false);
    setSuccessNotice(true);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // confetti fallback
    }

    setTimeout(() => setSuccessNotice(false), 5000);
  };

  const getStatusBadge = (status: DonationStatus) => {
    switch (status) {
      case 'terverifikasi':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Terverifikasi
          </span>
        );
      case 'menunggu_verifikasi':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            Menunggu Verifikasi
          </span>
        );
      case 'ditolak':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            <Clock className="w-3 h-3 text-slate-500" />
            Menunggu Pembayaran
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Infaq & Shadaqah Digital
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dukung program tahfidz, santunan sosial, dan dakwah Qur’ani UNINUS
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
          <HeartHandshake className="w-5 h-5" />
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Alhamdulillah, Transaksi Infaq Berhasil Dikirim!</p>
            <p className="text-emerald-700 mt-0.5">
              Admin keuangan akan memverifikasi bukti transfer Anda. Terima kasih atas partisipasi amal jariyah.
            </p>
          </div>
        </div>
      )}

      {/* Tabs (Matching screenshot: Infaq & Shadaqah) */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-xs mx-auto">
        <button
          onClick={() => {
            setActiveTab('infaq');
            setCategoryName('Infaq - Siswa');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'infaq'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Infaq
        </button>
        <button
          onClick={() => {
            setActiveTab('shadaqah');
            setCategoryName('Shadaqah - Sosial');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'shadaqah'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Shadaqah
        </button>
      </div>

      {/* Main Banner Card (Matching exact screenshot: Total Terkumpul Rp 5.250.000 + Infaq Sekarang Button) */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white rounded-3xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden space-y-4">
        <div className="absolute inset-0 bg-pattern-dark opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-200">
            Total Dana Terkumpul
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
            {formatRupiah(totalCollectedAll)}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-sm mx-auto">
            Dana infaq dan shadaqah yang telah diaudit & diverifikasi oleh pengurus
          </p>

          <div className="pt-4">
            <button
              onClick={() => setShowDonateModal(true)}
              className="py-3 px-8 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold rounded-2xl text-xs shadow-md transition transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Infaq Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Informasi Pembayaran Resmi (GOPAY & Rekening) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Informasi Rekening & Saluran Pembayaran Infak Resmi
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Saluran resmi penerimaan infaq & shadaqah Ikraamul Qur’an UNINUS
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            Terverifikasi Pengurus
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* GO-PAY Highlight Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 via-emerald-50 to-emerald-100/70 border-2 border-emerald-300 relative overflow-hidden flex flex-col justify-between shadow-2xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-emerald-950 uppercase tracking-wider">
                      GO-PAY
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-700 text-white">
                      Utama
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium">a.n. <strong className="font-bold text-slate-900">Neneng</strong></p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-700 font-semibold block">Nomor GO-PAY:</span>
                <span className="text-base sm:text-lg font-black text-emerald-950 tracking-wider">
                  082262855600
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyGoPay}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {copiedGoPay ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedGoPay ? 'Tersalin!' : 'Salin Nomor'}</span>
              </button>
            </div>
          </div>

          {/* Bank BSI Alternative Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900">Bank Syariah Indonesia (BSI)</span>
                  <p className="text-[11px] text-slate-500">a.n. Ikraamul Quran UNINUS</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Nomor Rekening BSI:</span>
                <span className="text-sm font-extrabold text-slate-800 tracking-wide font-mono">
                  7123-4567-89
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('7123456789');
                  alert('Nomor rekening BSI berhasil disalin!');
                }}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Donation Programs Grid */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900">Program Terbuka Saat Ini</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {donationPrograms.map((prog) => {
            const percentage = Math.min(100, Math.round((prog.collectedAmount / prog.targetAmount) * 100));
            return (
              <div
                key={prog.id}
                className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {prog.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-2">{prog.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{prog.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Terkumpul:</span>
                    <span className="font-extrabold text-emerald-800">
                      {formatRupiah(prog.collectedAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Target: {formatRupiah(prog.targetAmount)}</span>
                    <span className="font-bold text-emerald-700">{percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Riwayat Transaksi (Matching screenshot: Infaq - Siswa, Shadaqah - Sosial, Infaq - Jumat) */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Riwayat Transaksi Pribadi</h3>
            <p className="text-xs text-slate-500">Catatan riwayat donasi dari akun Anda</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
            {memberDonations.length} Transaksi
          </span>
        </div>

        {memberDonations.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            Belum ada transaksi donasi yang tercatat dari akun Anda.
          </p>
        ) : (
          <div className="space-y-3">
            {memberDonations.map((don) => (
              <div
                key={don.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-emerald-50/30 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{don.category}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatDateTime(don.createdAt)} • Ref: {don.paymentReference}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="font-extrabold text-xs text-emerald-800">
                    {formatRupiah(don.amount)}
                  </p>
                  {getStatusBadge(don.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Laporan Penyaluran Dana Transparan */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Laporan Penyaluran Dana</h3>
            <p className="text-xs text-slate-500">Transparansi penyaluran infaq untuk kemaslahatan umat</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            Publikasi Resmi
          </span>
        </div>

        <div className="space-y-3">
          {disbursements.map((disb) => (
            <div
              key={disb.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {disb.programTitle}
                </span>
                <p className="text-xs font-semibold text-slate-800 mt-1">{disb.description}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Penerima: {disb.recipient} • {formatShortDate(disb.createdAt)}
                </p>
              </div>
              <span className="font-extrabold text-xs text-rose-700 shrink-0">
                - {formatRupiah(disb.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Infaq / Donation Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Formulir Donasi Digital
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Infaq & Shadaqah UNINUS
                </h3>
              </div>
              <button
                onClick={() => setShowDonateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitDonation} className="space-y-4">
              {/* Program selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Program Tujuan
                </label>
                <select
                  value={selectedProgramId}
                  onChange={(e) => setSelectedProgramId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
                >
                  {donationPrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori
                </label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none"
                >
                  <option value="Infaq - Siswa">Infaq Siswa / Mahasiswa</option>
                  <option value="Infaq - Jumat">Infaq Jumat Berkah</option>
                  <option value="Shadaqah - Sosial">Shadaqah Santunan Sosial</option>
                  <option value="Wakaf - Mushaf">Wakaf Pengadaan Mushaf</option>
                </select>
              </div>

              {/* Preset Nominal Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Nominal Donasi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((pVal) => (
                    <button
                      type="button"
                      key={pVal}
                      onClick={() => handlePresetSelect(pVal)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                        amount === pVal
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {formatRupiah(pVal)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Nominal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Atau Masukkan Nominal Lain (Rp)
                </label>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Saluran Pembayaran
                </label>
                <div className="space-y-2">
                  {/* Primary GO-PAY Option */}
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                      paymentMethod === 'gopay'
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gopay"
                      checked={paymentMethod === 'gopay'}
                      onChange={() => setPaymentMethod('gopay')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">GO-PAY: 082262855600</span>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-700 text-white uppercase">
                          Utama
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                        a.n. <strong>Neneng</strong> (Bebas Biaya Admin)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyGoPay();
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      {copiedGoPay ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedGoPay ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qris"
                      checked={paymentMethod === 'qris'}
                      onChange={() => setPaymentMethod('qris')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-xs text-slate-900">QRIS (Gopay / OVO / Dana / BCA)</p>
                      <p className="text-[10px] text-slate-500">Scan instan bebas biaya admin</p>
                    </div>
                    <QrCode className="w-5 h-5 text-emerald-700 shrink-0" />
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                      paymentMethod === 'transfer_bsi'
                        ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer_bsi"
                      checked={paymentMethod === 'transfer_bsi'}
                      onChange={() => setPaymentMethod('transfer_bsi')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-xs text-slate-900">Bank Syariah Indonesia (BSI)</p>
                      <p className="text-[10px] text-slate-500">No. Rek: 7123-4567-89 a.n Ikraamul Quran UNINUS</p>
                    </div>
                    <Building className="w-5 h-5 text-slate-600 shrink-0" />
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan / Doa Titipan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: Mohon doa untuk kelancaran hafalan 30 Juz..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Security notice */}
              <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 leading-relaxed">
                🔒 Transaksi Anda aman. Verifikasi pembayaran disahkan secara resmi oleh Admin Keuangan Ikraamul Qur’an UNINUS.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md"
                >
                  {isSubmitting ? 'Memproses...' : 'Kirim Infaq Sekarang'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDonateModal(false)}
                  className="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
