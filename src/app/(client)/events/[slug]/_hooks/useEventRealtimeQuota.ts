'use client';

import { useState, useEffect } from 'react';
import { TicketCategory } from '@/types';
import { API_BASE_URL } from '@/lib/api';

export const useEventRealtimeQuota = (
  eventId?: string,
  initialCategories: TicketCategory[] = [],
) => {
  const [categories, setCategories] = useState<TicketCategory[]>(initialCategories);

  useEffect(() => {
    if (initialCategories.length > 0) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  useEffect(() => {
    if (!eventId) return;

    // Gunakan basis API_BASE_URL dinamis dari central api lib
    const eventSource = new EventSource(`${API_BASE_URL}/realtime/events/${eventId}/quota`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'INITIAL_QUOTA' || data.type === 'QUOTA_UPDATE') {
          if (data.categories && Array.isArray(data.categories)) {
            setCategories((prevCategories) => {
              return prevCategories.map((prev) => {
                const matched = data.categories.find((c: any) => c.id === prev.id);
                if (matched) {
                  return {
                    ...prev,
                    remainingCapacity: matched.remainingCapacity,
                    totalCapacity: matched.totalCapacity,
                  };
                }
                return prev;
              });
            });
          }
        }
      } catch (e) {
        console.error('[Realtime Quota Error]:', e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [eventId]);

  return categories;
};
