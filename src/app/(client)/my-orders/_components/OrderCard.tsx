import React from 'react';
import { Calendar, MapPin, QrCode, RefreshCw, Loader2, CreditCard, XCircle } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  ticketLoading: boolean;
  syncLoadingId: string | null;
  payLoadingId: string | null;
  cancelLoadingId: string | null;
  onViewTicket: (id: string) => void;
  onSyncStatus: (id: string) => void;
  onResumePayment: (id: string) => void;
  onCancelOrder: (id: string) => void;
}

export const OrderCard = ({
  order,
  ticketLoading,
  syncLoadingId,
  payLoadingId,
  cancelLoadingId,
  onViewTicket,
  onSyncStatus,
  onResumePayment,
  onCancelOrder,
}: OrderCardProps) => {
  const isSyncing = syncLoadingId === order.id;
  const isPaying = payLoadingId === order.id;
  const isCancelling = cancelLoadingId === order.id;

  return (
    <div className="premium-card rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#464554]/30 hover:border-[#4cd7f6]/40 transition duration-300">
      <div className="space-y-3 flex-grow">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-bold text-[#e4e1ed]">{order.event?.title || 'Concert Ticket'}</h3>
          <StatusBadge status={order.status} />
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-[#c7c4d7]">
          <div className="flex items-center gap-1.5 bg-[#13131b] px-3 py-1.5 rounded-xl border border-[#464554]/30">
            <Calendar className="w-4 h-4 text-[#c0c1ff]" />
            <span>
              {order.event?.date
                ? new Date(order.event.date).toLocaleDateString('id-ID', { dateStyle: 'full' })
                : 'Upcoming Date'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#13131b] px-3 py-1.5 rounded-xl border border-[#464554]/30">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>{order.event?.location || 'Venue'}</span>
          </div>
        </div>

        <div className="text-xs text-[#908fa0] pt-1 flex items-center gap-2">
          <span className="font-semibold text-white">
            {order.orderItems?.map((item) => `${item.ticketCategory?.name || 'Ticket'} (x${item.quantity})`).join(', ')}
          </span>
          <span>•</span>
          <span className="font-extrabold text-[#c0c1ff]">
            Total: Rp {Number(order.totalAmount).toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#464554]/20">
        {/* JIKA STATUS PENDING: Tampilkan tombol Bayar Sekarang, Cek Status, dan Batalkan */}
        {order.status === 'PENDING' && (
          <>
            <button
              onClick={() => onResumePayment(order.id)}
              disabled={isPaying}
              className="btn-primary text-[#003640] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-40"
            >
              {isPaying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
              <span>{isPaying ? 'Opening Snap...' : 'Bayar Sekarang'}</span>
            </button>

            <button
              onClick={() => onSyncStatus(order.id)}
              disabled={isSyncing}
              className="btn-secondary text-[#c0c1ff] hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              title="Cek Verifikasi Pembayaran"
            >
              {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Cek Status</span>
            </button>

            <button
              onClick={() => onCancelOrder(order.id)}
              disabled={isCancelling}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition"
              title="Batalkan Pesanan Ini"
            >
              {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            </button>
          </>
        )}

        {/* JIKA STATUS CANCELLED: Berikan tombol Cek Status (Auto-Recovery jika user sudah transfer) */}
        {order.status === 'CANCELLED' && (
          <button
            onClick={() => onSyncStatus(order.id)}
            disabled={isSyncing}
            className="btn-secondary text-[#c0c1ff] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            title="Sudah transfer? Klik untuk memulihkan tiket Anda"
          >
            {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Sudah Transfer? Cek Status</span>
          </button>
        )}

        {/* JIKA STATUS PAID / CHECKED_IN: Tampilkan E-Ticket QR Pass */}
        {(order.status === 'PAID' || order.status === 'CHECKED_IN') && (
          <button
            onClick={() => onViewTicket(order.id)}
            disabled={ticketLoading}
            className="btn-primary text-[#003640] px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <QrCode className="w-4 h-4" />
            <span>View Digital Pass</span>
          </button>
        )}
      </div>
    </div>
  );
};
