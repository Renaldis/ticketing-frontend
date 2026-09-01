'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, API_BASE_URL } from '@/lib/api';
import { EventItem, PlatformSummary } from '@/types';

export const useAdminOverview = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [telemetryScope, setTelemetryScope] = useState<string>('ALL');
  const [overallSummary, setOverallSummary] = useState<PlatformSummary | null>(null);
  const [eventSummary, setEventSummary] = useState<PlatformSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsRes, overallRes] = await Promise.all([
        api.get('/events?limit=50&upcomingOnly=false'),
        api.get('/admin/summary'),
      ]);

      const eventList = eventsRes.data?.data?.events || [];
      setEvents(eventList);
      setOverallSummary(overallRes.data?.data?.summary || null);

      if (telemetryScope !== 'ALL') {
        fetchEventSummary(telemetryScope);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [telemetryScope]);

  const fetchEventSummary = async (eventId: string) => {
    try {
      const res = await api.get(`/admin/events/${eventId}/summary`);
      setEventSummary(res.data?.data?.summary || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Admin Real-time SSE Telemetry Stream
  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/realtime/admin/stream`);

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'ADMIN_TELEMETRY_SYNC') {
          // Re-fetch data terbaru di background tanpa full page reload
          fetchInitialData();
        }
      } catch (err) {
        console.error('[Admin SSE Stream Error]:', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [fetchInitialData]);

  const handleScopeChange = (scope: string) => {
    setTelemetryScope(scope);
    if (scope !== 'ALL') {
      fetchEventSummary(scope);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInitialData();
  };

  const currentMetric = telemetryScope === 'ALL' ? overallSummary : eventSummary;

  return {
    events,
    telemetryScope,
    overallSummary,
    eventSummary,
    currentMetric,
    loading,
    refreshing,
    fetchInitialData,
    handleScopeChange,
    handleRefresh,
  };
};
