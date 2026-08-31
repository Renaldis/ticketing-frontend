'use client';

import React from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { useAdminOverview } from './_hooks/useAdminOverview';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { TelemetryTiles } from './_components/TelemetryTiles';
import { EventsOverviewGrid } from './_components/EventsOverviewGrid';

export default function AdminDashboardPage() {
  const {
    events,
    telemetryScope,
    eventSummary,
    currentMetric,
    loading,
    refreshing,
    fetchInitialData,
    handleScopeChange,
  } = useAdminOverview();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4cd7f6] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Platform Telemetry & Metrics"
        subtitle="Real-time revenue stream, quota allocations, and attendance velocity"
        onOpenSidebar={() => {}}
        onRefresh={fetchInitialData}
        refreshing={refreshing}
        events={events}
        selectedEventId={telemetryScope}
        onScopeChange={handleScopeChange}
        showScopeSelector={true}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1">
        {currentMetric && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#4cd7f6]" />
                  <span>
                    {telemetryScope === 'ALL'
                      ? 'Platform Aggregate Telemetry'
                      : `Event: ${eventSummary?.title}`}
                  </span>
                </h2>
                <p className="text-xs text-[#908fa0] mt-0.5">
                  {telemetryScope === 'ALL'
                    ? 'Consolidated data across all events, settled revenues, and turnstile entries'
                    : `Live metrics and category utilization for ${eventSummary?.location}`}
                </p>
              </div>
            </div>

            <TelemetryTiles metric={currentMetric} />

            {/* Single Event Tier Breakdown */}
            {telemetryScope !== 'ALL' && eventSummary?.categories && (
              <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Tier-by-Tier Allocation Progress ({eventSummary.title})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventSummary.categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-[#13131b] border border-[#464554]/30 rounded-xl p-5 space-y-3"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white text-sm">{cat.name}</span>
                        <span className="text-[#4cd7f6] font-black">
                          {cat.sold} / {cat.totalCapacity} ({cat.soldPercentage})
                        </span>
                      </div>
                      <div className="w-full bg-[#1f1f27] rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#6366f1] to-[#4cd7f6] h-2.5 rounded-full transition-all duration-700"
                          style={{ width: cat.soldPercentage }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Platform Active Events Cards */}
            {telemetryScope === 'ALL' && (
              <EventsOverviewGrid events={events} onSelectEvent={handleScopeChange} />
            )}
          </>
        )}
      </main>
    </>
  );
}
