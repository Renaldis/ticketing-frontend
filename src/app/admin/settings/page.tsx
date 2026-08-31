'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Server, Database } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminSettingsPage() {
  return (
    <>
      <AdminHeader
        title="Platform Security & Infrastructure"
        subtitle="Inspect high-assurance concurrency policies, idempotency locks, and asynchronous workers"
        onOpenSidebar={() => {}}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1 max-w-4xl">
        <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>High-Concurrency Protection Engines</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="bg-[#13131b] p-5 rounded-xl border border-[#464554]/30 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>PostgreSQL Row-Level Locking & Atomic Decrement</span>
              </div>
              <p className="text-[#908fa0] leading-relaxed">
                Every ticket booking request executes SQL atomic conditional update{' '}
                <code className="text-[#4cd7f6] font-mono">WHERE remaining_capacity &gt;= quantity</code> to mathematically prevent overselling during flash sale traffic bursts.
              </p>
              <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                Active & Guaranteed Zero Race-Condition
              </span>
            </div>

            <div className="bg-[#13131b] p-5 rounded-xl border border-[#464554]/30 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Redis Idempotency Key Guard</span>
              </div>
              <p className="text-[#908fa0] leading-relaxed">
                Prevents duplicate transactions from network re-tries and double-clicks by locking client-generated UUID headers for 120s with 24-hour response caching.
              </p>
              <span className="inline-block text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md">
                Active in Request Interceptors
              </span>
            </div>

            <div className="bg-[#13131b] p-5 rounded-xl border border-[#464554]/30 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>BullMQ Auto-Release Expiration Worker</span>
              </div>
              <p className="text-[#908fa0] leading-relaxed">
                Asynchronously polls pending payment reservations. If an order remains unpaid past 120,000ms (2 mins), tickets are released back to the active pool without blocking HTTP threads.
              </p>
              <span className="inline-block text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-md">
                Worker Running in Background Thread
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
