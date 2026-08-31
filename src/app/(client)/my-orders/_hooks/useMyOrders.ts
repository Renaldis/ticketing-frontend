'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

declare global {
  interface Window {
    snap: any;
  }
}

export const useMyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PAID' | 'CANCELLED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [syncLoadingId, setSyncLoadingId] = useState<string | null>(null);
  const [payLoadingId, setPayLoadingId] = useState<string | null>(null);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

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
      alert(err.response?.data?.message || 'Failed to load ticket pass.');
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
        alert('Payment Verified! Your ticket is now PAID & active.');
      } else {
        alert(`Payment status: ${updatedOrder?.status || 'PENDING'}`);
      }
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to sync status.');
    } finally {
      setSyncLoadingId(null);
    }
  };

  // --- RESUME PAYMENT (BUKA KEMBALI SNAP MODAL) ---
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
            alert('Payment transaction failed.');
          },
          onClose: function () {
            fetchOrders();
          },
        });
      } else {
        alert('Could not initialize Midtrans Snap modal.');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to resume payment.');
      fetchOrders();
    } finally {
      setPayLoadingId(null);
    }
  };

  // --- CANCEL ORDER (USER MEMBATALKAN SECARA MANUAL) ---
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this pending booking? Tickets will be returned to pool.')) {
      return;
    }
    setCancelLoadingId(orderId);
    try {
      await api.post(`/orders/${orderId}/cancel`);
      alert('Order cancelled successfully.');
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelLoadingId(null);
    }
  };

  // Filtered orders berdasarkan Tab
  const filteredOrders = orders.filter((ord) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return ord.status === 'PENDING';
    if (activeTab === 'PAID') return ord.status === 'PAID' || ord.status === 'CHECKED_IN';
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
    cancelLoadingId,
    handleViewTicket,
    handleSyncStatus,
    handleResumePayment,
    handleCancelOrder,
    user,
  };
};
