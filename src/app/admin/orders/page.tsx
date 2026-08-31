'use client';

import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useAdminOrders } from './_hooks/useAdminOrders';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { OrdersTable } from './_components/OrdersTable';

export default function AdminOrdersPage() {
  const {
    filteredOrders,
    loading,
    refreshing,
    orderStatusFilter,
    setOrderStatusFilter,
    orderSearchQuery,
    setOrderSearchQuery,
    fetchOrders,
  } = useAdminOrders();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4cd7f6] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Global Transactions Ledger"
        subtitle="Real-time audit log of customer bookings, payment status, and gateway settlement verification"
        onOpenSidebar={() => {}}
        onRefresh={fetchOrders}
        refreshing={refreshing}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1 overflow-y-auto">
        <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Order Transactions ({filteredOrders.length})</h2>
              <p className="text-xs text-[#908fa0]">Full ledger history captured across all events</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#908fa0]" />
                <input
                  type="text"
                  placeholder="Search customer, order ID..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="input-glass pl-9 pr-3.5 py-2 rounded-xl text-xs text-white placeholder-[#908fa0] w-64"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="input-glass text-xs text-white rounded-xl px-4 py-2 font-bold focus:outline-none"
              >
                <option value="ALL" className="bg-[#13131b]">All Statuses</option>
                <option value="PAID" className="bg-[#13131b]">PAID</option>
                <option value="CHECKED_IN" className="bg-[#13131b]">CHECKED_IN</option>
                <option value="PENDING" className="bg-[#13131b]">PENDING</option>
                <option value="CANCELLED" className="bg-[#13131b]">CANCELLED</option>
              </select>
            </div>
          </div>

          <OrdersTable orders={filteredOrders} />
        </div>
      </main>
    </>
  );
}
