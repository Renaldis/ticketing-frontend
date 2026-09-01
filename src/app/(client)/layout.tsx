'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="border-t border-[#292932]/60 bg-[#0d0d15] py-8 text-center text-xs text-[#908fa0]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white tracking-wider">
              TICKET<span className="text-[#4cd7f6]">IX</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>Platform Tiket Berkecepatan Tinggi</span>
          </div>
          <p>&copy; {new Date().getFullYear()} TICKETIX Concurrency Platform. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </>
  );
}
