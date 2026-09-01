import React from 'react';
import { DollarSign, Ticket, CheckCircle2, Users, TrendingUp } from 'lucide-react';
import { PlatformSummary } from '@/types';

export const TelemetryTiles = ({ metric }: { metric: PlatformSummary }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="premium-card rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start text-[#908fa0] text-xs font-bold uppercase">
          <span>Total Pendapatan</span>
          <DollarSign className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <div className="text-2xl font-black text-emerald-400">
            Rp {Number(metric.financials.totalRevenue).toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400/80 font-bold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{metric.financials.successfulOrdersCount} transaksi lunas</span>
          </div>
        </div>
      </div>

      <div className="premium-card rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start text-[#908fa0] text-xs font-bold uppercase">
          <span>Tiket Terjual</span>
          <Ticket className="w-5 h-5 text-[#c0c1ff]" />
        </div>
        <div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-2xl font-black text-[#c0c1ff]">{metric.capacity.totalSold}</span>
            <span className="text-xs text-[#908fa0] mb-0.5">/ {metric.capacity.totalCapacity}</span>
          </div>
          <div className="w-full bg-[#1f1f27] rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#4cd7f6] to-[#6366f1] h-2 rounded-full transition-all duration-500"
              style={{ width: metric.capacity.overallSoldPercentage }}
            ></div>
          </div>
        </div>
      </div>

      <div className="premium-card rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start text-[#908fa0] text-xs font-bold uppercase">
          <span>Telah Masuk Gate</span>
          <CheckCircle2 className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <div className="text-2xl font-black text-purple-400">
            {metric.attendance.checkedInAttendees} Pengunjung
          </div>
          <span className="text-[11px] text-[#908fa0] mt-1 block">Telah di-scan di pintu masuk</span>
        </div>
      </div>

      <div className="premium-card rounded-2xl p-5 flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start text-[#908fa0] text-xs font-bold uppercase">
          <span>Sisa Kuota Tersedia</span>
          <Users className="w-5 h-5 text-[#4cd7f6]" />
        </div>
        <div>
          <div className="text-2xl font-black text-[#4cd7f6]">
            {metric.capacity.totalRemaining} Tiket
          </div>
          <span className="text-[11px] text-[#4cd7f6] font-bold mt-1 block">Siap untuk dipesan</span>
        </div>
      </div>
    </div>
  );
};
