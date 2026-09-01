'use client';

import { useState, useEffect } from 'react';
import { TicketCategory } from '@/types';

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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const eventSource = new EventSource(`${apiUrl}/realtime/events/${eventId}/quota`);

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
