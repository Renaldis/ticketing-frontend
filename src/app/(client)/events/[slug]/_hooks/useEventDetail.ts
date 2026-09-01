'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, generateUUID } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { EventItem, TicketCategory } from '@/types';
import { toast } from 'sonner';

declare global {
  interface Window {
    snap: any;
  }
}

export const useEventDetail = (slugOrId: string) => {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [feePercent, setFeePercent] = useState<number>(2);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const router = useRouter();

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const [res, feeRes] = await Promise.all([
        api.get(`/events/${slugOrId}`),
        api.get('/settings/fee').catch(() => ({ data: { data: { feePercent: 2 } } })),
      ]);

      const data = res.data?.data?.event;
      setEvent(data);
      setFeePercent(feeRes.data?.data?.feePercent ?? 2);

      if (data?.ticketCategories?.length > 0) {
        setCategories(data.ticketCategories);
        setSelectedCategory((prev) => prev || data.ticketCategories[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat detail event.');
    } finally {
      setLoading(false);
    }
  }, [slugOrId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Real-time SSE Quota Listener (Mendukung ID maupun Slug)
  useEffect(() => {
    if (!slugOrId) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const eventSource = new EventSource(`${apiUrl}/realtime/events/${slugOrId}/quota`);

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'INITIAL_QUOTA' || data.type === 'QUOTA_UPDATE') {
          if (data.categories && Array.isArray(data.categories)) {
            setCategories((prevCategories) => {
              const updated = prevCategories.map((prev) => {
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

              // Sinkronkan juga ke state `event` utama
              setEvent((prevEvent) =>
                prevEvent ? { ...prevEvent, ticketCategories: updated } : null,
              );

              return updated;
            });
          }
        }
      } catch (err) {
        console.error('[SSE Quota Parse Error]:', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [slugOrId]);

  const activeCategory = categories.find((c: TicketCategory) => c.id === selectedCategory);
  const subtotal = activeCategory ? Number(activeCategory.price) * quantity : 0;
  const isFree = subtotal === 0;
  const platformFee = isFree ? 0 : Math.round((subtotal * feePercent) / 100);
  const grandTotal = subtotal + platformFee;

  const handleBooking = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!selectedCategory || !event) {
      setError('Silakan pilih salah satu kategori tiket.');
      return;
    }

    setError('');
    setBookingLoading(true);

    try {
      const idempotencyKey = generateUUID();
      const res = await api.post(
        '/checkout',
        {
          eventId: event.id,
          ticketCategoryId: selectedCategory,
          quantity: Number(quantity),
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        },
      );

      const { payment, order } = res.data.data;

      // Jika tiket gratis (total bayar Rp 0 / payment null)
      if (!payment || Number(order?.totalAmount) === 0) {
        toast.success('Tiket Gratis Berhasil Diklaim! Mengalihkan ke Tiket Saya...');
        router.push('/my-orders');
        return;
      }

      if (payment?.token && window.snap) {
        window.snap.pay(payment.token, {
          onSuccess: function () {
            toast.success('Pembayaran Berhasil! Mengalihkan ke Tiket Saya...');
            router.push('/my-orders');
          },
          onPending: function () {
            toast.info('Menunggu penyelesaian pembayaran...');
            router.push('/my-orders');
          },
          onError: function () {
            setError('Transaksi pembayaran dibatalkan.');
          },
          onClose: function () {
            router.push('/my-orders');
          },
        });
      } else {
        router.push('/my-orders');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Pemesanan gagal. Silakan coba lagi.');
    } finally {
      setBookingLoading(false);
    }
  };

  return {
    event,
    categories,
    selectedCategory,
    setSelectedCategory,
    quantity,
    setQuantity,
    loading,
    bookingLoading,
    error,
    activeCategory,
    subtotal,
    feePercent,
    platformFee,
    grandTotal,
    isFree,
    handleBooking,
  };
};
