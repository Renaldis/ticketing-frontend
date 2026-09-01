'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Ticket, LogOut, LayoutDashboard, QrCode, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isExploreActive = pathname === '/events' || pathname.startsWith('/events/');
  const isMyOrdersActive = pathname.startsWith('/my-orders');
  const isAdminPortalActive = pathname === '/admin';
  const isAdminScannerActive = pathname === '/admin/scanner';

  return (
    <nav className="flex justify-between items-center px-6 sm:px-10 w-full h-16 sticky top-0 z-50 bg-[#13131b]/85 backdrop-blur-xl border-b border-[#464554]/30 shadow-sm">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-[#13131b] rounded-[7px] flex items-center justify-center">
              <Ticket className="w-4 h-4 text-[#4cd7f6]" />
            </div>
          </div>
          <span className="font-bold text-xl text-[#4cd7f6] tracking-tight">TICKETIX</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/events"
          className={`text-sm font-semibold transition-all ${
            isExploreActive
              ? 'text-[#c0c1ff] font-bold border-b-2 border-[#c0c1ff] pb-1'
              : 'text-[#c7c4d7] hover:text-[#c0c1ff]'
          }`}
        >
          Jelajahi Event
        </Link>

        <Link
          href="/my-orders"
          className={`text-sm font-semibold transition-all ${
            isMyOrdersActive
              ? 'text-[#c0c1ff] font-bold border-b-2 border-[#c0c1ff] pb-1'
              : 'text-[#c7c4d7] hover:text-[#c0c1ff]'
          }`}
        >
          Tiket Saya
        </Link>

        {user?.role === 'ADMIN' && (
          <div className="flex items-center space-x-2 bg-[#1b1b23] border border-indigo-500/30 px-3 py-1 rounded-lg">
            <Link
              href="/admin"
              className={`text-xs font-bold flex items-center gap-1 transition ${
                isAdminPortalActive ? 'text-cyan-300 underline' : 'text-indigo-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Portal Admin</span>
            </Link>
            <span className="text-[#464554]">|</span>
            <Link
              href="/admin/scanner"
              className={`text-xs font-bold flex items-center gap-1 transition ${
                isAdminScannerActive ? 'text-cyan-300 underline' : 'text-cyan-300 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scanner Gate</span>
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-[#c7c4d7] font-semibold">{user.name || user.email}</span>
            <button
              onClick={logout}
              className="p-2 text-[#908fa0] hover:text-rose-400 rounded-lg hover:bg-[#1f1f27] transition"
              title="Keluar Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="btn-secondary text-[#c0c1ff] font-semibold text-xs px-6 py-2 rounded-lg"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="btn-primary text-[#003640] font-bold text-xs px-6 py-2 rounded-lg"
            >
              Daftar
            </Link>
          </div>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#e4e1ed] p-1.5 rounded-lg hover:bg-[#1f1f27]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#e4e1ed]" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#13131b] border-b border-[#292932] p-5 space-y-4 shadow-2xl">
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm font-semibold ${
              isExploreActive ? 'text-[#c0c1ff] font-bold' : 'text-[#c7c4d7]'
            }`}
          >
            Jelajahi Event
          </Link>
          <Link
            href="/my-orders"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm font-semibold ${
              isMyOrdersActive ? 'text-[#c0c1ff] font-bold' : 'text-[#c7c4d7]'
            }`}
          >
            Tiket Saya
          </Link>
          {user?.role === 'ADMIN' && (
            <>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-semibold ${
                  isAdminPortalActive ? 'text-cyan-300 font-bold' : 'text-indigo-300'
                }`}
              >
                Portal Eksekutif Admin
              </Link>
              <Link
                href="/admin/scanner"
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm font-semibold ${
                  isAdminScannerActive ? 'text-cyan-300 font-bold' : 'text-cyan-300'
                }`}
              >
                Scanner Tiket Gate
              </Link>
            </>
          )}
          <div className="pt-3 border-t border-[#292932] flex items-center justify-between">
            {user ? (
              <>
                <span className="text-xs text-slate-300 font-bold">{user.name || user.email}</span>
                <button onClick={logout} className="text-xs text-rose-400 font-bold">Keluar</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 w-full">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center btn-secondary py-2 rounded-lg text-xs font-bold text-white">Masuk</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-center btn-primary py-2 rounded-lg text-xs font-bold text-[#003640]">Daftar</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
