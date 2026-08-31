'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, generateUUID } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { EventItem, TicketCategory } from '@/types';

declare global {
  interface Window {
    snap: any;
  }
}

export const useEventDetail = (slugOrId: string) => {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const router = useRouter();

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${slugOrId}`);
      const data = res.data?.data?.event;
      setEvent(data);
      if (data?.ticketCategories?.length > 0) {
        setSelectedCategory(data.ticketCategories[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load event details.');
    } finally {
      setLoading(false);
    }
  }, [slugOrId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleBooking = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!selectedCategory || !event) {
      setError('Please select a ticket category.');
      return;
    }

    setError('');
    setBookingLoading(true);

    try {
      const idempotencyKey = generateUUID();
      const res = await api.post(
        '/checkout',
        {
          eventId: event.id, // Selalu kirim UUID event ID ke endpoint checkout
          ticketCategoryId: selectedCategory,
          quantity: Number(quantity),
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        },
      );

      const { payment } = res.data.data;

      if (payment?.token && window.snap) {
        window.snap.pay(payment.token, {
          onSuccess: function () {
            router.push('/my-orders');
          },
          onPending: function () {
            router.push('/my-orders');
          },
          onError: function () {
            setError('Payment transaction failed.');
          },
          onClose: function () {
            router.push('/my-orders');
          },
        });
      } else {
        router.push('/my-orders');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const activeCategory = event?.ticketCategories.find((c: TicketCategory) => c.id === selectedCategory);
  const subtotal = activeCategory ? Number(activeCategory.price) * quantity : 0;
  const platformFee = Math.round(subtotal * 0.02);
  const grandTotal = subtotal + platformFee;

  return {
    event,
    selectedCategory,
    setSelectedCategory,
    quantity,
    setQuantity,
    loading,
    bookingLoading,
    error,
    activeCategory,
    subtotal,
    platformFee,
    grandTotal,
    handleBooking,
  };
};
