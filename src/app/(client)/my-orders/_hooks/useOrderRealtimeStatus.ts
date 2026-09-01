'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const eventSource = new EventSource(`${apiUrl}/realtime/orders/${orderId}/status`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ORDER_STATUS_UPDATE' && data.status) {
          setStatus(data.status);
          if (data.status === 'PAID') {
            toast.success('Pembayaran Berhasil! Tiket Anda telah aktif.');
          } else if (data.status === 'CANCELLED') {
            toast.error('Pesanan telah dibatalkan / waktu pembayaran habis.');
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
