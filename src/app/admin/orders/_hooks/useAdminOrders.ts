'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { Order } from '@/types';

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/orders?limit=100');
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = orderStatusFilter === 'ALL' || ord.status === orderStatusFilter;
    const matchesSearch =
      orderSearchQuery === '' ||
      (ord.user?.name && ord.user.name.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (ord.user?.email && ord.user.email.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (ord.event?.title && ord.event.title.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      ord.id.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return {
    orders,
    filteredOrders,
    loading,
    refreshing,
    orderStatusFilter,
    setOrderStatusFilter,
    orderSearchQuery,
    setOrderSearchQuery,
    fetchOrders,
  };
};
