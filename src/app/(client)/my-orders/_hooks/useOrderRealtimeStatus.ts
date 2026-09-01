'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/api';

export const useOrderRealtimeStatus = (
  orderId?: string,
  initialStatus?: string,
  onStatusChanged?: (newStatus: string) => void,
) => {
  const [status, setStatus] = useState<string | undefined>(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    if (!orderId || status === 'PAID' || status === 'CHECKED_IN') return;

    const eventSource = new EventSource(`${API_BASE_URL}/realtime/orders/${orderId}/status`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ORDER_STATUS_UPDATE' && data.status) {
          setStatus(data.status);
          if (data.status === 'PAID') {
            toast.success('Pembayaran Terverifikasi! Tiket Anda aktif.', {
              id: `payment-status-${orderId}`,
            });
          } else if (data.status === 'CANCELLED') {
            toast.error('Pesanan telah dibatalkan / waktu pembayaran habis.', {
              id: `payment-status-${orderId}`,
            });
          }
          if (onStatusChanged) {
            onStatusChanged(data.status);
          }
        }
      } catch (e) {
        console.error('[Realtime Status Error]:', e);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [orderId, status, onStatusChanged]);

  return status;
};
