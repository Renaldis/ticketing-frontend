'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Receipt,
  QrCode,
  Settings,
  PlusCircle,
  ArrowUpRight,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onOpenCreateModal?: () => void;
  eventCount?: number;
  orderCount?: number;
}

export const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  onOpenCreateModal,
  eventCount = 0,
  orderCount = 0,
}: AdminSidebarProps) => {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Ringkasan & Telemetri',
      href: '/admin',
      active: pathname === '/admin',
      icon: LayoutDashboard,
    },
    {
      label: `Katalog Event ${eventCount ? `(${eventCount})` : ''}`,
      href: '/admin/events',
      active: pathname.startsWith('/admin/events'),
      icon: Calendar,
    },
    {
      label: 'Manajer Tiket & Kuota',
      href: '/admin/tickets',
      active: pathname.startsWith('/admin/tickets'),
      icon: Ticket,
    },
    {
      label: `Buku Transaksi ${orderCount ? `(${orderCount})` : ''}`,
      href: '/admin/orders',
      active: pathname.startsWith('/admin/orders'),
      icon: Receipt,
    },
    {
      label: 'Aplikasi Scanner Gate',
      href: '/admin/scanner',
      active: pathname.startsWith('/admin/scanner'),
      icon: QrCode,
      highlight: true,
    },
    {
      label: 'Keamanan Sistem',
      href: '/admin/settings',
      active: pathname.startsWith('/admin/settings'),
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#13131b] border-r border-[#464554]/30 z-50 flex flex-col justify-between transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Header Profile */}
      <div className="p-5 border-b border-[#464554]/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-[#13131b] rounded-[11px] flex items-center justify-center font-bold text-sm text-[#4cd7f6]">
              {(user?.name || user?.email || 'A')[0].toUpperCase()}
            </div>
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white truncate">
              {user?.name || 'Manajer Event'}
            </h2>
            <span className="text-[10px] text-[#4cd7f6] uppercase font-extrabold tracking-wider block">
              Tier Eksekutif
            </span>
          </div>
        </div>

        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-[#908fa0] p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${
                item.highlight
                  ? 'text-emerald-400 hover:bg-emerald-500/10'
                  : item.active
                    ? 'bg-[#03b5d3]/15 text-[#4cd7f6] border-r-4 border-[#4cd7f6]'
                    : 'text-[#c7c4d7] hover:bg-[#1f1f27] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action */}
      <div className="p-4 border-t border-[#464554]/30 space-y-2">
        {onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="btn-primary w-full text-[#003640] font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Event Baru</span>
          </button>
        )}

        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 text-[#908fa0] hover:text-white text-[11px] py-2 font-semibold"
        >
          <span>Kembali ke Web Publik</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
};
