'use client';

import React from 'react';
import { QrCode, CheckCircle2, XCircle } from 'lucide-react';
import { useGateScanner } from './_hooks/useGateScanner';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function GateScannerPage() {
  const {
    scanResult,
    scanError,
    manualOrderId,
    setManualOrderId,
    isProcessing,
    handleManualSubmit,
  } = useGateScanner();

  return (
    <>
      <AdminHeader
        title="Pemindai Optik Pintu Gerbang Gate"
        subtitle="Validasi optik kamera QR code langsung dan pencegahan masuk ganda (anti-double entry)"
        onOpenSidebar={() => {}}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1 max-w-2xl mx-auto w-full">
        <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-cyan-500/10 text-[#4cd7f6] rounded-xl border border-cyan-500/30">
              <QrCode className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Pindai Kode QR Tiket Pengunjung</h2>
            <p className="text-xs text-[#908fa0]">Arahkan kamera optik ke kode QR digital pengunjung</p>
          </div>

          <div className="bg-[#0d0d15] rounded-2xl p-4 border border-[#464554]/40 overflow-hidden">
            <div id="qr-reader" className="w-full text-[#908fa0] text-xs"></div>
          </div>

          <form onSubmit={handleManualSubmit} className="flex gap-2 text-xs">
            <input
              type="text"
              placeholder="Tempel ID Pesanan atau JSON payload..."
              value={manualOrderId}
              onChange={(e) => setManualOrderId(e.target.value)}
              className="input-glass w-full rounded-xl px-3.5 py-2.5 text-white"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="btn-primary text-[#003640] font-bold px-5 py-2.5 rounded-xl flex-shrink-0"
            >
              Verifikasi
            </button>
          </form>

          {scanResult && (
            <div className="p-5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="font-extrabold text-sm text-white">AKSES DIIZINKAN / TELAH MASUK</span>
              </div>
              <div className="bg-[#0d0d15]/90 p-3.5 rounded-lg border border-[#464554]/30 text-xs space-y-1.5 text-[#c7c4d7]">
                <div className="flex justify-between">
                  <span className="text-[#908fa0]">Pengunjung:</span>
                  <span className="font-bold text-white">{scanResult.attendee?.name || scanResult.attendee?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#908fa0]">Nama Event:</span>
                  <span className="font-semibold text-white">{scanResult.event?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#908fa0]">Kategori Tiket:</span>
                  <span className="font-bold text-[#4cd7f6]">
                    {scanResult.tickets?.map((t: any) => `${t.category} (x${t.quantity})`).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {scanError && (
            <div className="p-5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <XCircle className="w-6 h-6 text-rose-400" />
                <span className="font-extrabold text-sm text-white">AKSES DITOLAK</span>
              </div>
              <p className="text-xs text-rose-300">{scanError}</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
