'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

export const useMyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketLoading, setTicketLoading] = useState(false);

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

  return {
    orders,
    loading,
    authLoading,
    selectedTicket,
    setSelectedTicket,
    ticketLoading,
    handleViewTicket,
    user,
  };
};
