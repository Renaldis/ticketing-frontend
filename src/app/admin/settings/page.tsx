'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  ShieldCheck,
  Sparkles,
  Server,
  Database,
  Clock,
  Save,
  Loader2,
  Percent,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [ttlMinutes, setTtlMinutes] = useState<number>(15);
  const [feePercent, setFeePercent] = useState<number>(2);
  const [_loading, setLoading] = useState(true);
  const [savingTtl, setSavingTtl] = useState(false);
  const [savingFee, setSavingFee] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [ttlRes, feeRes] = await Promise.all([
        api.get('/admin/settings/expiration'),
        api.get('/admin/settings/fee'),
      ]);
      setTtlMinutes(ttlRes.data?.data?.ttlMinutes || 15);
      setFeePercent(feeRes.data?.data?.feePercent ?? 2);
    } catch (err) {
      console.error('Error fetching settings:', err);
      toast.error('Gagal mengambil pengaturan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTtl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTtl(true);

    try {
      await api.put('/admin/settings/expiration', {
        ttlMinutes: Number(ttlMinutes),
      });
      toast.success(`Durasi countdown pembayaran berhasil diubah ke ${ttlMinutes} menit!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan pengaturan durasi.');
    } finally {
      setSavingTtl(false);
    }
  };

  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFee(true);

    try {
      await api.put('/admin/settings/fee', {
        feePercent: Number(feePercent),
      });
      toast.success(`Biaya layanan platform berhasil diubah ke ${feePercent}%!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan pengaturan biaya layanan.');
    } finally {
      setSavingFee(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="Keamanan & Pengaturan Sistem"
        subtitle="Kelola timer countdown pembayaran, persentase fee platform, dan proteksi concurrency"
        onOpenSidebar={() => {}}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1 max-w-4xl">
        {/* DYNAMIC EXPIRATION TIMER CARD */}
        <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-[#464554]/30">
          <div className="flex items-center justify-between pb-4 border-b border-[#464554]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Batas Waktu Pembayaran (BullMQ & Midtrans TTL)
                </h2>
                <p className="text-xs text-[#908fa0]">
                  Atur durasi countdown pembayaran invoice sebelum pesanan hangus dan stok tiket
                  direstock otomatis
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#4cd7f6] bg-[#03b5d3]/10 px-3 py-1 rounded-full border border-[#03b5d3]/30">
              Antrean BullMQ Live
            </span>
          </div>

          <form onSubmit={handleSaveTtl} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-xs font-bold uppercase text-[#908fa0] mb-2">
                  Durasi Countdown:{' '}
                  <span className="text-white font-extrabold">{ttlMinutes} Menit</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="60"
                  step="1"
                  value={ttlMinutes}
                  onChange={(e) => setTtlMinutes(parseInt(e.target.value, 10))}
                  className="w-full accent-[#4cd7f6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#908fa0] mt-1">
                  <span>2 Menit (Uji Kilat)</span>
                  <span>15 Menit (Standar)</span>
                  <span>60 Menit (Maksimal)</span>
                </div>
              </div>

              <div className="bg-[#13131b] p-4 rounded-xl border border-[#464554]/30 text-xs space-y-1 text-[#c7c4d7]">
                <span className="font-bold text-white block">Sinkronisasi Midtrans:</span>
                <p className="text-[#908fa0]">
                  Invoice Snap akan otomatis kadaluarsa dalam{' '}
                  <code className="text-[#4cd7f6] font-mono">
                    {(ttlMinutes * 60).toLocaleString()} detik
                  </code>{' '}
                  ({(ttlMinutes * 60 * 1000).toLocaleString()}ms).
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingTtl}
              className="btn-primary text-[#003640] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 disabled:opacity-40"
            >
              {savingTtl ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan Batas Waktu</span>
            </button>
          </form>
        </div>

        {/* DYNAMIC PLATFORM FEE CARD */}
        <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-[#464554]/30">
          <div className="flex items-center justify-between pb-4 border-b border-[#464554]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-[#4cd7f6]">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Biaya Layanan Platform (Platform Fee %)
                </h2>
                <p className="text-xs text-[#908fa0]">
                  Tentukan persentase biaya admin layanan pada setiap transaksi checkout tiket
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#c0c1ff] bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
              Kalkulasi Dinamis
            </span>
          </div>

          <form onSubmit={handleSaveFee} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-xs font-bold uppercase text-[#908fa0] mb-2">
                  Biaya Layanan:{' '}
                  <span className="text-[#4cd7f6] font-extrabold text-base">{feePercent}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={feePercent}
                  onChange={(e) => setFeePercent(parseFloat(e.target.value))}
                  className="w-full accent-[#4cd7f6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#908fa0] mt-1">
                  <span>0% (Bebas Biaya)</span>
                  <span>2% (Standar)</span>
                  <span>10% (Maksimal)</span>
                </div>
              </div>

              <div className="bg-[#13131b] p-4 rounded-xl border border-[#464554]/30 text-xs space-y-1 text-[#c7c4d7]">
                <span className="font-bold text-white block">Simulasi Perhitungan:</span>
                <p className="text-[#908fa0]">
                  Tiket Rp 100.000 + Fee {feePercent}% = Total tagihan resmi Midtrans adalah{' '}
                  <strong className="text-white">
                    Rp {(100000 + (100000 * feePercent) / 100).toLocaleString('id-ID')}
                  </strong>
                  .
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingFee}
              className="btn-primary text-[#003640] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 disabled:opacity-40"
            >
              {savingFee ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan Persentase Fee</span>
            </button>
          </form>
        </div>

        {/* SECURITY ARCHITECTURE ENGINES */}
        <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Mesin Proteksi Concurrency & Kemananan</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="bg-[#13131b] p-5 rounded-xl border border-[#464554]/30 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Penguncian Baris Database PostgreSQL & Atomic Decrement</span>
              </div>
              <p className="text-[#908fa0] leading-relaxed">
                Setiap pemesanan mengeksekusi update kondisional atomik{' '}
                <code className="text-[#4cd7f6] font-mono">
                  WHERE remaining_capacity &gt;= quantity
                </code>{' '}
                untuk menjamin ketiadaan overselling saat lonjakan traffic flash sale.
              </p>
              <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                Aktif & Bergaransi Bebas Race-Condition
              </span>
            </div>

            <div className="bg-[#13131b] p-5 rounded-xl border border-[#464554]/30 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Penjaga Kunci Idempotensi Redis</span>
              </div>
              <p className="text-[#908fa0] leading-relaxed">
                Mencegah transaksi ganda dari klik berulang atau koneksi retry dengan mengunci
                header UUID selama 120 detik dan caching respon 24 jam.
              </p>
              <span className="inline-block text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md">
                Aktif di Interceptor Permintaan
              </span>
            </div>

            <div className="bg-[#13131b] p-5 rounded-xl border border-[#464554]/30 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Pemulihan Otomatis Pembayaran Terlambat (Auto-Recovery)</span>
              </div>
              <p className="text-[#908fa0] leading-relaxed">
                Jika order dibatalkan oleh timer sebelum transfer terkonfirmasi, sistem secara
                otomatis mengecek kuota live dan memulihkan status tiket menjadi{' '}
                <code className="text-emerald-400 font-mono">PAID</code>.
              </p>
              <span className="inline-block text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-md">
                Aktif di Webhook & Handler Status
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
