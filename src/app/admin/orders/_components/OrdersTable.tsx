import React from 'react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Order } from '@/types';

export const OrdersTable = ({ orders }: { orders: Order[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[#464554]/40 text-[#908fa0] uppercase font-bold tracking-wider">
            <th className="pb-3.5">ID Pesanan</th>
            <th className="pb-3.5">Pelanggan</th>
            <th className="pb-3.5">Nama Event</th>
            <th className="pb-3.5">Kategori Tier</th>
            <th className="pb-3.5">Total Bayar</th>
            <th className="pb-3.5">Status</th>
            <th className="pb-3.5">Waktu Transaksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#464554]/20">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-[#908fa0]">
                Tidak ada pesanan yang sesuai dengan kriteria filter.
              </td>
            </tr>
          ) : (
            orders.map((ord) => (
              <tr key={ord.id} className="text-[#c7c4d7] hover:bg-[#1b1b23]/50 transition">
                <td className="py-4 font-mono text-[11px] text-[#4cd7f6]">
                  {ord.id.substring(0, 8)}...
                </td>
                <td className="py-4 font-bold text-white">
                  {ord.user?.name || 'Pelanggan'}
                  <span className="block text-[10px] font-normal text-[#908fa0]">
                    {ord.user?.email}
                  </span>
                </td>
                <td className="py-4 font-medium text-[#e4e1ed]">{ord.event?.title}</td>
                <td className="py-4 text-[#908fa0]">
                  {ord.orderItems
                    ?.map((i) => `${i.ticketCategory?.name} (x${i.quantity})`)
                    .join(', ')}
                </td>
                <td className="py-4 font-black text-[#c0c1ff]">
                  Rp {Number(ord.totalAmount).toLocaleString('id-ID')}
                </td>
                <td className="py-4">
                  <StatusBadge status={ord.status} />
                </td>
                <td className="py-4 text-[#908fa0]">
                  {new Date(ord.createdAt).toLocaleString('id-ID', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
