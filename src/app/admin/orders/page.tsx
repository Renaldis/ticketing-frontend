'use client';

import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useAdminOrders } from './_hooks/useAdminOrders';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { OrdersTable } from './_components/OrdersTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
        title="Buku Transaksi Global"
        subtitle="Log audit transaksi pemesanan tiket, status pembayaran, dan verifikasi settlement gateway"
        onOpenSidebar={() => {}}
        onRefresh={fetchOrders}
        refreshing={refreshing}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1">
        <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Log Transaksi ({filteredOrders.length})
              </h2>
              <p className="text-xs text-[#908fa0]">
                Seluruh riwayat transaksi pelanggan di semua event
              </p>
            </div>

            {/* Filter Bar with Shadcn Select */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#908fa0]" />
                <input
                  type="text"
                  placeholder="Cari pelanggan, ID pesanan..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="input-glass pl-9 pr-3.5 py-2 rounded-xl text-xs text-white placeholder-[#908fa0] w-64 h-10"
                />
              </div>

              <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                <SelectTrigger className="w-[170px] h-10">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="PAID">Lunas (PAID)</SelectItem>
                  <SelectItem value="CHECKED_IN">Telah Masuk (CHECKED_IN)</SelectItem>
                  <SelectItem value="PENDING">Menunggu Bayar (PENDING)</SelectItem>
                  <SelectItem value="CANCELLED">Batal (CANCELLED)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <OrdersTable orders={filteredOrders} />
        </div>
      </main>
    </>
  );
}
