import React from 'react';
import { Clock, CheckCircle2, XCircle, ListFilter, CalendarCheck2, History } from 'lucide-react';
import { Order } from '@/types';

export type OrderTabKey = 'ALL' | 'PENDING' | 'ACTIVE' | 'CHECKED_IN' | 'EXPIRED' | 'CANCELLED';

interface OrderTabsProps {
  activeTab: OrderTabKey;
  setActiveTab: (tab: OrderTabKey) => void;
  orders: Order[];
}

export const OrderTabs = ({ activeTab, setActiveTab, orders }: OrderTabsProps) => {
  const now = new Date();

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  // Tiket Aktif = PAID & Belum melewati 24 jam setelah jam mulai acara
  const activeCount = orders.filter(
    (o) =>
      o.status === 'PAID' &&
      new Date(o.event?.date).getTime() + 24 * 60 * 60 * 1000 >= now.getTime(),
  ).length;

  // Sudah Digunakan = CHECKED_IN
  const usedCount = orders.filter((o) => o.status === 'CHECKED_IN').length;

  // Acara Selesai / Hangus = PAID tapi sudah melewati 24 jam setelah acara
  const expiredCount = orders.filter(
    (o) =>
      o.status === 'PAID' &&
      new Date(o.event?.date).getTime() + 24 * 60 * 60 * 1000 < now.getTime(),
  ).length;

  // Dibatalkan = CANCELLED
  const cancelledCount = orders.filter((o) => o.status === 'CANCELLED').length;

  const tabs: Array<{
    key: OrderTabKey;
    label: string;
    count: number;
    icon: any;
    highlight?: boolean;
    color?: string;
  }> = [
    { key: 'ALL', label: 'Semua Pesanan', count: orders.length, icon: ListFilter },
    {
      key: 'PENDING',
      label: 'Menunggu Pembayaran',
      count: pendingCount,
      icon: Clock,
      highlight: pendingCount > 0,
    },
    {
      key: 'ACTIVE',
      label: 'Tiket Aktif (Ready)',
      count: activeCount,
      icon: CalendarCheck2,
      highlight: activeCount > 0,
      color: 'text-emerald-400',
    },
    {
      key: 'CHECKED_IN',
      label: 'Sudah Digunakan',
      count: usedCount,
      icon: CheckCircle2,
    },
    {
      key: 'EXPIRED',
      label: 'Acara Selesai / Hangus',
      count: expiredCount,
      icon: History,
    },
    {
      key: 'CANCELLED',
      label: 'Dibatalkan',
      count: cancelledCount,
      icon: XCircle,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isSelected = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition duration-200 border ${
              isSelected
                ? 'bg-gradient-to-r from-[#03b5d3] to-[#4cd7f6] text-[#003640] border-transparent shadow-lg shadow-cyan-500/20 scale-105'
                : 'bg-[#13131b] text-[#c7c4d7] border-[#464554]/40 hover:border-[#c0c1ff] hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                isSelected
                  ? 'bg-[#003640] text-[#4cd7f6]'
                  : tab.highlight
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-[#1f1f27] text-[#908fa0]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
