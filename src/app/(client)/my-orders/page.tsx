'use client';

import React from 'react';
import { Ticket, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMyOrders } from './_hooks/useMyOrders';
import { OrderCard } from './_components/OrderCard';
import { TicketPassModal } from './_components/TicketPassModal';

export default function MyOrdersPage() {
  const {
    orders,
    loading,
    authLoading,
    selectedTicket,
    setSelectedTicket,
    ticketLoading,
    syncLoadingId,
    handleViewTicket,
    handleSyncStatus,
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
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-10">
      <div className="mb-10 pb-6 border-b border-[#464554]/30">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e4e1ed] tracking-tight">My Orders</h1>
        <p className="text-[#908fa0] text-sm mt-1">View your order receipts and access cryptographic passes</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 premium-card rounded-2xl">
          <Ticket className="w-12 h-12 text-[#908fa0] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Tickets Ordered Yet</h3>
          <p className="text-sm text-[#908fa0] mb-6">Explore the live events and reserve your passes.</p>
          <Link href="/events" className="btn-primary text-[#003640] px-6 py-2.5 rounded-xl font-bold text-xs">
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              ticketLoading={ticketLoading}
              syncLoadingId={syncLoadingId}
              onViewTicket={handleViewTicket}
              onSyncStatus={handleSyncStatus}
            />
          ))}
        </div>
      )}

      <TicketPassModal
        ticket={selectedTicket}
        user={user}
        onClose={() => setSelectedTicket(null)}
      />
    </main>
  );
}
