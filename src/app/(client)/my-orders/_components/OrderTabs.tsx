import React from 'react';
import { Clock, CheckCircle2, XCircle, ListFilter } from 'lucide-react';
import { Order } from '@/types';

interface OrderTabsProps {
  activeTab: 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED';
  setActiveTab: (tab: 'ALL' | 'PENDING' | 'PAID' | 'CANCELLED') => void;
  orders: Order[];
}

export const OrderTabs = ({ activeTab, setActiveTab, orders }: OrderTabsProps) => {
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const paidCount = orders.filter((o) => o.status === 'PAID' || o.status === 'CHECKED_IN').length;
  const cancelledCount = orders.filter((o) => o.status === 'CANCELLED').length;

  const tabs = [
    { key: 'ALL', label: 'Semua Pesanan', count: orders.length, icon: ListFilter },
    { key: 'PENDING', label: 'Menunggu Pembayaran', count: pendingCount, icon: Clock, highlight: pendingCount > 0 },
    { key: 'PAID', label: 'Tiket Aktif (Paid)', count: paidCount, icon: CheckCircle2 },
    { key: 'CANCELLED', label: 'Dibatalkan / Expired', count: cancelledCount, icon: XCircle },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isSelected = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
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
                  ? 'bg-amber-500/20 text-amber-300'
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
