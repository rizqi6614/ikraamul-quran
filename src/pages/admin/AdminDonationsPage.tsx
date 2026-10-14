import React, { useState } from 'react';
import { useAppStore } from '@/services/store/appStore';
import { Donation, DonationProgram } from '@/types';
import {
  HeartHandshake,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Eye,
  X,
  Building,
  TrendingDown,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { formatRupiah, formatDateTime } from '@/utils/formatters';

export const AdminDonationsPage: React.FC = () => {
  const {
    donations,
    donationPrograms,
    disbursements,
    verifyDonation,
    createDonationProgram,
    createDisbursement
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'transaksi' | 'program' | 'penyaluran'>('transaksi');
  const [selectedProof, setSelectedProof] = useState<Donation | null>(null);
  const [showProgramModal, setShowProgramModal] = useState<boolean>(false);
  const [showDisburseModal, setShowDisburseModal] = useState<boolean>(false);

  // New program form
  const [newProgram, setNewProgram] = useState({
    title: '',
    description: '',
    category: 'Tahfidz' as any,
    targetAmount: 5000000,
    status: 'active' as any,
    createdBy: 'admin-iqbal-01'
  });

  // Disbursement form
  const [newDisbursement, setNewDisbursement] = useState({
    programId: donationPrograms[0]?.id || '',
    amount: 1000000,
    description: '',
    recipient: '',
    createdBy: 'admin-iqbal-01'
  });

  const totalCollected = donationPrograms.reduce((acc, p) => acc + p.collectedAmount, 0);
  const totalDisbursed = disbursements.reduce((acc, d) => acc + d.amount, 0);
  const netBalance = totalCollected - totalDisbursed;

  const handleVerify = async (donId: string, approve: boolean) => {
    await verifyDonation(donId, approve);
    setSelectedProof(null);
    alert(`Transaksi berhasil ${approve ? 'DIVERIFIKASI dan dana dicatatkan' : 'DITOLAK'}.`);
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDonationProgram(newProgram);
    setShowProgramModal(false);
    alert('Program penggalangan dana baru berhasil dibuat.');
  };

  const handleCreateDisbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    const prog = donationPrograms.find((p) => p.id === newDisbursement.programId) || donationPrograms[0];
    await createDisbursement({
      ...newDisbursement,
      programTitle: prog?.title || 'Program Tahfidz'
    });
    setShowDisburseModal(false);
    alert('Penyaluran dana berhasil dicatat dalam pembukuan transparan.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Infaq & Shadaqah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi transfer, kelola program penggalangan, dan catat audit penyaluran dana
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowProgramModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Program Baru</span>
          </button>
          <button
            onClick={() => setShowDisburseModal(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs transition shadow-2xs flex items-center gap-1.5"
          >
            <TrendingDown className="w-4 h-4" />
            <span>Catat Penyaluran</span>
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-2xs">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Dana Masuk</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">{formatRupiah(totalCollected)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Infaq & shadaqah terverifikasi</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-2xs">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Penyaluran</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-800 mt-1">{formatRupiah(totalDisbursed)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Untuk beasiswa & fasilitas tahfidz</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-2xs">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Saldo Tersedia</span>
            <Building className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-teal-900 mt-1">{formatRupiah(netBalance)}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Kas dakwah UNINUS</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('transaksi')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'transaksi'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Verifikasi Transaksi ({donations.filter((d) => d.status === 'menunggu_verifikasi').length})
        </button>
        <button
          onClick={() => setActiveTab('program')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'program'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Daftar Program
        </button>
        <button
          onClick={() => setActiveTab('penyaluran')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition text-center ${
            activeTab === 'penyaluran'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Penyaluran ({disbursements.length})
        </button>
      </div>

      {/* Tab 1: Verifikasi Transaksi */}
      {activeTab === 'transaksi' && (
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {donations.map((don) => (
            <div
              key={don.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-emerald-50/20 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{don.memberName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {don.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{don.programTitle}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ref: {don.paymentReference} • {formatDateTime(don.createdAt)}
                </p>
                {don.notes && (
                  <p className="text-xs text-slate-600 italic mt-1">Doa: “{don.notes}”</p>
                )}
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="font-extrabold text-sm text-emerald-800">
                  {formatRupiah(don.amount)}
                </span>

                {don.status === 'menunggu_verifikasi' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerify(don.id, true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verifikasi</span>
                    </button>
                    <button
                      onClick={() => handleVerify(don.id, false)}
                      className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Tolak</span>
                    </button>
                  </div>
                ) : (
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      don.status === 'terverifikasi'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {don.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Program Infaq */}
      {activeTab === 'program' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {donationPrograms.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-2xs space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {p.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{p.status}</span>
              </div>
              <h4 className="font-bold text-xs text-slate-900">{p.title}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2">{p.description}</p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[11px] text-slate-500">Terkumpul:</p>
                <p className="font-extrabold text-sm text-emerald-800">{formatRupiah(p.collectedAmount)}</p>
                <p className="text-[10px] text-slate-400">Target: {formatRupiah(p.targetAmount)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Penyaluran Dana */}
      {activeTab === 'penyaluran' && (
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {disbursements.map((disb) => (
            <div key={disb.id} className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-slate-900">{disb.programTitle}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{disb.description}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Penerima: {disb.recipient} • {formatDateTime(disb.createdAt)}
                </p>
              </div>
              <span className="font-extrabold text-sm text-rose-700">
                - {formatRupiah(disb.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Program */}
      {showProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">Buat Program Infaq Baru</h3>
              <button onClick={() => setShowProgramModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Program</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Wakaf Mushaf Santri Baru UNINUS"
                  value={newProgram.title}
                  onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi & Tujuan</label>
                <textarea
                  rows={2}
                  required
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newProgram.category}
                    onChange={(e) => setNewProgram({ ...newProgram, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Tahfidz">Tahfidz</option>
                    <option value="Sosial">Sosial</option>
                    <option value="Masjid">Masjid</option>
                    <option value="Al-Qur'an">Al-Qur'an</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Dana (Rp)</label>
                  <input
                    type="number"
                    value={newProgram.targetAmount}
                    onChange={(e) => setNewProgram({ ...newProgram, targetAmount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Publikasikan Program
                </button>
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Disburse */}
      {showDisburseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">Catat Penyaluran Dana Infaq</h3>
              <button onClick={() => setShowDisburseModal(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDisbursement} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sumber Program</label>
                <select
                  value={newDisbursement.programId}
                  onChange={(e) => setNewDisbursement({ ...newDisbursement, programId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  {donationPrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jumlah Dana Disalurkan (Rp)</label>
                <input
                  type="number"
                  required
                  value={newDisbursement.amount}
                  onChange={(e) => setNewDisbursement({ ...newDisbursement, amount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-rose-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Penerima / Vendor</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Penerima Beasiswa Beras Tahfidz"
                  value={newDisbursement.recipient}
                  onChange={(e) => setNewDisbursement({ ...newDisbursement, recipient: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rincian Penggunaan</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Keterangan alokasi belanja..."
                  value={newDisbursement.description}
                  onChange={(e) => setNewDisbursement({ ...newDisbursement, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
                >
                  Simpan Catatan Audit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDisburseModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold"
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
