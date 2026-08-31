import React from 'react';
import Link from 'next/link';
import { EventItem } from '@/types';

interface EventsOverviewGridProps {
  events: EventItem[];
  onSelectEvent: (id: string) => void;
}

export const EventsOverviewGrid = ({ events, onSelectEvent }: EventsOverviewGridProps) => {
  return (
    <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Active Events Breakdown ({events.length})
        </h3>
        <Link href="/admin/events" className="text-xs text-[#4cd7f6] hover:underline font-bold">
          Manage All Events &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((evt) => {
          const totalCap = evt.ticketCategories?.reduce((acc: number, c: any) => acc + c.totalCapacity, 0) || 0;
          const remCap = evt.ticketCategories?.reduce((acc: number, c: any) => acc + c.remainingCapacity, 0) || 0;
          const soldCap = totalCap - remCap;
          const pct = totalCap > 0 ? Math.round((soldCap / totalCap) * 100) : 0;

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(evt.id)}
              className="bg-[#13131b] border border-[#464554]/30 hover:border-[#4cd7f6]/50 rounded-xl p-4 space-y-3 cursor-pointer transition"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-white line-clamp-1">{evt.title}</span>
                <span className="text-[10px] font-bold text-[#4cd7f6]">{pct}% Sold</span>
              </div>

              <div className="w-full bg-[#1f1f27] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[10px] text-[#908fa0]">
                <span>{remCap} Left</span>
                <span>{totalCap} Total Capacity</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
