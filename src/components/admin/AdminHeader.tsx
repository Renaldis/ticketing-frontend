'use client';

import React from 'react';
import { Menu, RefreshCw } from 'lucide-react';
import { ScopeSelector } from './ScopeSelector';
import { EventItem } from '@/types';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  onOpenSidebar: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  events?: EventItem[];
  selectedEventId?: string;
  onScopeChange?: (id: string) => void;
  showScopeSelector?: boolean;
}

export const AdminHeader = ({
  title,
  subtitle,
  onOpenSidebar,
  onRefresh,
  refreshing = false,
  events = [],
  selectedEventId = 'ALL',
  onScopeChange,
  showScopeSelector = false,
}: AdminHeaderProps) => {
  return (
    <header className="h-20 min-h-[5rem] flex-shrink-0 px-6 sm:px-10 bg-[#13131b]/85 backdrop-blur-xl border-b border-[#464554]/30 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl text-white hover:bg-[#1f1f27]"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-[11px] text-[#908fa0] leading-normal">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showScopeSelector && onScopeChange && (
          <ScopeSelector
            events={events}
            selectedEventId={selectedEventId}
            onScopeChange={onScopeChange}
          />
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-[#1f1f27] hover:bg-[#292932] text-[#c7c4d7] hover:text-white border border-[#464554]/40 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
    </header>
  );
};
