'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { ShieldCheck, Sparkles, Server, Database, Clock, Save, Loader2 } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [ttlMinutes, setTtlMinutes] = useState<number>(15);
  const [_loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/settings/expiration');
      setTtlMinutes(res.data?.data?.ttlMinutes || 15);
    } catch (err) {
      console.error('Error fetching settings:', err);
      toast.error('Gagal mengambil pengaturan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTtl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/admin/settings/expiration', {
        ttlMinutes: Number(ttlMinutes),
      });
      toast.success(`Durasi countdown pembayaran berhasil diubah ke ${ttlMinutes} menit!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan pengaturan durasi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="Platform Security & Infrastructure"
        subtitle="Manage dynamic expiration countdown, concurrency engines, and BullMQ workers"
        onOpenSidebar={() => {}}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1 max-w-4xl">
        {/* DYNAMIC EXPIRATION TIMER CARD */}
        <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-[#464554]/30">
          <div className="flex items-center justify-between pb-4 border-b border-[#464554]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Payment Reservation Countdown (BullMQ TTL)
                </h2>
                <p className="text-xs text-[#908fa0]">
                  Configure how long tickets remain reserved before un-paid orders auto-cancel and
                  restock
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#4cd7f6] bg-[#03b5d3]/10 px-3 py-1 rounded-full border border-[#03b5d3]/30">
              Live BullMQ Queue
            </span>
          </div>

          <form onSubmit={handleSaveTtl} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-xs font-bold uppercase text-[#908fa0] mb-2">
                  Timer Duration:{' '}
                  <span className="text-white font-extrabold">{ttlMinutes} Minutes</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="60"
                  step="1"
                  value={ttlMinutes}
                  onChange={(e) => setTtlMinutes(parseInt(e.target.value, 10))}
                  className="w-full accent-[#4cd7f6] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#908fa0] mt-1">
                  <span>2 Mins (Fast Test)</span>
                  <span>15 Mins (Standard)</span>
                  <span>60 Mins (Max)</span>
                </div>
              </div>

              <div className="bg-[#13131b] p-4 rounded-xl border border-[#464554]/30 text-xs space-y-1 text-[#c7c4d7]">
                <span className="font-bold text-white block">Applied Delay:</span>
                <p className="text-[#908fa0]">
                  New checkouts will queue a delayed BullMQ job of{' '}
                  <code className="text-[#4cd7f6] font-mono">
                    {(ttlMinutes * 60).toLocaleString()} seconds
                  </code>{' '}
                  ({(ttlMinutes * 60 * 1000).toLocaleString()}ms).
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-[#003640] font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 disabled:opacity-40"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Timer Configuration</span>
            </button>
          </form>
        </div>

        {/* SECURITY ARCHITECTURE ENGINES */}
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
                <code className="text-[#4cd7f6] font-mono">
                  WHERE remaining_capacity &gt;= quantity
                </code>{' '}
                to mathematically prevent overselling during flash sale traffic bursts.
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
                Prevents duplicate transactions from network re-tries and double-clicks by locking
                client-generated UUID headers for 120s with 24-hour response caching.
              </p>
              <span className="inline-block text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md">
                Active in Request Interceptors
              </span>
            </div>

            <div className="bg-[#13131b] p-5 rounded-xl border border-[#464554]/30 space-y-2">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Smart Order Auto-Recovery (Late Settlement Handler)</span>
              </div>
              <p className="text-[#908fa0] leading-relaxed">
                If an order is cancelled by the worker before the bank sends the webhook, the system
                automatically checks live ticket capacity and restores the order to{' '}
                <code className="text-emerald-400 font-mono">PAID</code>.
              </p>
              <span className="inline-block text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-md">
                Active in Webhook & Sync Handlers
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
