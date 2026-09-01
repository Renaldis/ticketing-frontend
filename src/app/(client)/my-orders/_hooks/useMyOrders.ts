'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { OrderTabKey } from '../_components/OrderTabs';
import { toast } from 'sonner';

declare global {
  interface Window {
    snap: any;
  }
}

export const useMyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderTabKey>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [syncLoadingId, setSyncLoadingId] = useState<string | null>(null);
  const [payLoadingId, setPayLoadingId] = useState<string | null>(null);

  // Dialog Confirm Cancel Order
  const [cancelTargetOrder, setCancelTargetOrder] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      const fetchedOrders: Order[] = res.data?.data?.orders || [];
      setOrders(fetchedOrders);

      // Auto-sync status pembayaran jika mendarat dari Midtrans redirect dengan order_id / orderId
      const targetOrderId = searchParams.get('order_id') || searchParams.get('orderId');
      if (targetOrderId) {
        const found = fetchedOrders.find((o) => o.id === targetOrderId);
        if (found && found.status === 'PENDING') {
          handleSyncStatus(targetOrderId);
        }
        // Bersihkan query string agar tidak re-trigger sync saat refresh
        router.replace('/my-orders');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      fetchOrders();
    }
  }, [user, authLoading, router, fetchOrders]);

  const handleViewTicket = async (orderId: string) => {
    setTicketLoading(true);
    try {
      const res = await api.get(`/orders/${orderId}/ticket`);
      setSelectedTicket(res.data?.data?.ticket);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load ticket pass.');
    } finally {
      setTicketLoading(false);
    }
  };

  const handleSyncStatus = async (orderId: string) => {
    setSyncLoadingId(orderId);
    try {
      const res = await api.post(`/orders/${orderId}/sync-status`);
      const updatedOrder = res.data?.data?.order;
      if (updatedOrder?.status === 'PAID') {
        toast.success('Pembayaran Terverifikasi! Tiket Anda aktif.', {
          id: `payment-status-${orderId}`,
        });
      } else {
        toast.info(`Status pembayaran: ${updatedOrder?.status || 'PENDING'}`, {
          id: `payment-status-${orderId}`,
        });
      }
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal sinkronisasi pembayaran.');
    } finally {
      setSyncLoadingId(null);
    }
  };

  const handleResumePayment = async (orderId: string) => {
    setPayLoadingId(orderId);
    try {
      const res = await api.post(`/orders/${orderId}/pay`);
      const payment = res.data?.data?.payment;

      if (payment?.token && window.snap) {
        window.snap.pay(payment.token, {
          onSuccess: function () {
            handleSyncStatus(orderId);
          },
          onPending: function () {
            handleSyncStatus(orderId);
          },
          onError: function () {
            toast.error('Pembayaran gagal atau dibatalkan.');
          },
          onClose: function () {
            fetchOrders();
          },
        });
      } else {
        toast.error('Tidak dapat menginisialisasi pembayaran Midtrans.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal melanjutkan pembayaran.');
      fetchOrders();
    } finally {
      setPayLoadingId(null);
    }
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancelTargetOrder) return;
    setCancelling(true);

    try {
      await api.post(`/orders/${cancelTargetOrder.id}/cancel`);
      toast.success('Pesanan berhasil dibatalkan dan tiket dikembalikan ke kuota.');
      setCancelTargetOrder(null);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membatalkan pesanan.');
    } finally {
      setCancelling(false);
    }
  };

  // Filtered orders berdasarkan Tab
  const now = new Date();
  const filteredOrders = orders.filter((ord) => {
    const eventDate = ord.event?.date ? new Date(ord.event.date) : null;
    const eventEndTime = eventDate ? new Date(eventDate.getTime() + 24 * 60 * 60 * 1000) : null;
    const isPassed = eventEndTime ? now > eventEndTime : false;

    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return ord.status === 'PENDING';
    if (activeTab === 'ACTIVE') return ord.status === 'PAID' && !isPassed;
    if (activeTab === 'CHECKED_IN') return ord.status === 'CHECKED_IN';
    if (activeTab === 'EXPIRED') return ord.status === 'PAID' && isPassed;
    if (activeTab === 'CANCELLED') return ord.status === 'CANCELLED';
    return true;
  });

  return {
    orders,
    filteredOrders,
    activeTab,
    setActiveTab,
    loading,
    authLoading,
    selectedTicket,
    setSelectedTicket,
    ticketLoading,
    syncLoadingId,
    payLoadingId,
    cancelTargetOrder,
    setCancelTargetOrder,
    cancelling,
    handleViewTicket,
    handleSyncStatus,
    handleResumePayment,
    handleConfirmCancelOrder,
    user,
  };
};
