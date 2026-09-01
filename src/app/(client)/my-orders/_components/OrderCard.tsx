import React from 'react';
import {
  Calendar,
  MapPin,
  QrCode,
  RefreshCw,
  Loader2,
  CreditCard,
  XCircle,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Order } from '@/types';
import { useOrderRealtimeStatus } from '../_hooks/useOrderRealtimeStatus';

interface OrderCardProps {
  order: Order;
  ticketLoading: boolean;
  syncLoadingId: string | null;
  payLoadingId: string | null;
  onViewTicket: (id: string) => void;
  onSyncStatus: (id: string) => void;
  onResumePayment: (id: string) => void;
  onRequestCancel: (order: Order) => void;
  onOrderUpdated?: () => void;
}

export const OrderCard = ({
  order,
  ticketLoading,
  syncLoadingId,
  payLoadingId,
  onViewTicket,
  onSyncStatus,
  onResumePayment,
  onRequestCancel,
  onOrderUpdated,
}: OrderCardProps) => {
  const isSyncing = syncLoadingId === order.id;
  const isPaying = payLoadingId === order.id;

  // Real-time SSE listener untuk order ini (auto-update status seketika lunas)
  const realtimeStatus = useOrderRealtimeStatus(order.id, order.status, () => {
    if (onOrderUpdated) onOrderUpdated();
  });
  const currentStatus = realtimeStatus || order.status;

  const now = new Date();
  const eventDate = order.event?.date ? new Date(order.event.date) : null;
  // Tiket tetap berlaku hingga 24 jam setelah jam mulai acara (selaras dengan backend check-in)
  const eventEndTime = eventDate ? new Date(eventDate.getTime() + 24 * 60 * 60 * 1000) : null;
  const isEventPassed = eventEndTime ? now > eventEndTime : false;

  const isTicketActive = currentStatus === 'PAID' && !isEventPassed;
  const isTicketExpired = currentStatus === 'PAID' && isEventPassed;
  const isTicketUsed = currentStatus === 'CHECKED_IN';

  return (
    <div className="premium-card rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#464554]/30 hover:border-[#4cd7f6]/40 transition duration-300">
      <div className="space-y-3 flex-grow">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold text-[#e4e1ed]">
            {order.event?.title || 'Tiket Acara'}
          </h3>

          {/* Real-time Status Badge */}
          {isTicketActive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>TIKET AKTIF / SIAP PAKAI</span>
            </span>
          )}

          {isTicketUsed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              <span>SUDAH DIGUNAKAN</span>
            </span>
          )}

          {isTicketExpired && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-[#908fa0] border border-[#464554]/40">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>ACARA SELESAI / HANGUS</span>
            </span>
          )}

          {currentStatus === 'PENDING' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>MENUNGGU PEMBAYARAN</span>
            </span>
          )}

          {currentStatus === 'CANCELLED' && <StatusBadge status="CANCELLED" />}
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-[#c7c4d7]">
          <div className="flex items-center gap-1.5 bg-[#13131b] px-3 py-1.5 rounded-xl border border-[#464554]/30">
            <Calendar className="w-4 h-4 text-[#c0c1ff]" />
            <span>
              {eventDate
                ? eventDate.toLocaleDateString('id-ID', { dateStyle: 'full' })
                : 'Jadwal Acara'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#13131b] px-3 py-1.5 rounded-xl border border-[#464554]/30">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>{order.event?.location || 'Gedung Venue'}</span>
          </div>
        </div>

        <div className="text-xs text-[#908fa0] pt-1 flex items-center gap-2">
          <span className="font-semibold text-white">
            {order.orderItems
              ?.map((item) => `${item.ticketCategory?.name || 'Tiket'} (x${item.quantity})`)
              .join(', ')}
          </span>
          <span>•</span>
          <span className="font-extrabold text-[#c0c1ff]">
            Total: Rp {Number(order.totalAmount).toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#464554]/20">
        {currentStatus === 'PENDING' && (
          <>
            <button
              onClick={() => onResumePayment(order.id)}
              disabled={isPaying}
              className="btn-primary text-[#003640] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-40"
            >
              {isPaying ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CreditCard className="w-3.5 h-3.5" />
              )}
              <span>{isPaying ? 'Membuka Snap...' : 'Bayar Sekarang'}</span>
            </button>

            <button
              onClick={() => onSyncStatus(order.id)}
              disabled={isSyncing}
              className="btn-secondary text-[#c0c1ff] hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              title="Cek Verifikasi Pembayaran"
            >
              {isSyncing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>Cek Status</span>
            </button>

            <button
              onClick={() => onRequestCancel(order)}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition"
              title="Batalkan Pesanan Ini"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}

        {currentStatus === 'CANCELLED' && (
          <button
            onClick={() => onSyncStatus(order.id)}
            disabled={isSyncing}
            className="btn-secondary text-[#c0c1ff] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="Sudah transfer? Klik untuk memulihkan tiket Anda"
          >
            {isSyncing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>Sudah Transfer? Cek Status</span>
          </button>
        )}

        {isTicketActive && (
          <button
            onClick={() => onViewTicket(order.id)}
            disabled={ticketLoading}
            className="btn-primary text-[#003640] px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <QrCode className="w-4 h-4" />
            <span>Lihat E-Tiket QR</span>
          </button>
        )}

        {(isTicketUsed || isTicketExpired) && (
          <button
            onClick={() => onViewTicket(order.id)}
            disabled={ticketLoading}
            className="btn-secondary text-[#c7c4d7] hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Arsip Tiket</span>
          </button>
        )}
      </div>
    </div>
  );
};
