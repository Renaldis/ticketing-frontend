'use client';

import React from 'react';
import { Ticket, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMyOrders } from './_hooks/useMyOrders';
import { OrderCard } from './_components/OrderCard';
import { OrderTabs } from './_components/OrderTabs';
import { TicketPassModal } from './_components/TicketPassModal';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export default function MyOrdersPage() {
  const {
    orders,
    filteredOrders,
    activeTab,
    setActiveTab,
    loading,
    authLoading,
    selectedTicket,
    setSelectedTicket,
    ticketLoading,
    syncLoadingId,
    payLoadingId,
    cancelTargetOrder,
    setCancelTargetOrder,
    cancelling,
    handleViewTicket,
    handleSyncStatus,
    handleResumePayment,
    handleConfirmCancelOrder,
    user,
  } = useMyOrders();

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4cd7f6] animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-10 space-y-8">
      <div className="pb-6 border-b border-[#464554]/30">
        <span className="text-xs font-extrabold text-[#4cd7f6] uppercase tracking-widest block mb-1">
          Pass Management
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e4e1ed] tracking-tight">
          My Orders & Passes
        </h1>
        <p className="text-[#908fa0] text-sm mt-1">
          Review pending payments, continue checkouts, and access digital entry QR codes
        </p>
      </div>

      {/* Tabs Filter Bar */}
      <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} orders={orders} />

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 premium-card rounded-2xl">
          <Ticket className="w-12 h-12 text-[#908fa0] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Tidak Ada Pesanan di Kategori Ini</h3>
          <p className="text-sm text-[#908fa0] mb-6">
            {activeTab === 'PENDING'
              ? 'Tidak ada tagihan yang menunggu pembayaran.'
              : activeTab === 'ACTIVE'
                ? 'Anda belum memiliki tiket konser yang aktif.'
                : 'Jelajahi konser dan amankan tiket Anda sekarang.'}
          </p>
          <Link
            href="/events"
            className="btn-primary text-[#003640] px-6 py-2.5 rounded-xl font-bold text-xs"
          >
            Jelajahi Event
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              ticketLoading={ticketLoading}
              syncLoadingId={syncLoadingId}
              payLoadingId={payLoadingId}
              onViewTicket={handleViewTicket}
              onSyncStatus={handleSyncStatus}
              onResumePayment={handleResumePayment}
              onRequestCancel={setCancelTargetOrder}
            />
          ))}
        </div>
      )}

      {/* SHADCN ALERT DIALOG: CONFIRM CANCEL ORDER */}
      <AlertDialog
        open={!!cancelTargetOrder}
        onOpenChange={(open) => !open && setCancelTargetOrder(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pesanan Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Pesanan untuk <strong>{cancelTargetOrder?.event?.title}</strong> sebesar Rp{' '}
              {Number(cancelTargetOrder?.totalAmount).toLocaleString('id-ID')} akan dibatalkan.
              Kuota tiket akan dikembalikan ke pool penjualan dan invoice pembayaran akan
              dinonaktifkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Kembali</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancelOrder}
              disabled={cancelling}
              className="bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
            >
              {cancelling ? 'Membatalkan...' : 'Ya, Batalkan Pesanan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TicketPassModal
        ticket={selectedTicket}
        user={user}
        onClose={() => setSelectedTicket(null)}
      />
    </main>
  );
}
