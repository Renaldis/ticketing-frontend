'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { EventItem } from '@/types';

export const useAdminTickets = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [selectedEventIdForCat, setSelectedEventIdForCat] = useState<string>('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/events?limit=100');
      setEvents(res.data?.data?.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAdjustStock = async (categoryId: string, delta: number) => {
    try {
      await api.patch(`/events/categories/${categoryId}/stock`, { delta });
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to adjust stock.');
    }
  };

  const handleDeleteCategory = async (categoryId: string, catName: string) => {
    if (!confirm(`Delete ticket category "${catName}"?`)) return;

    try {
      await api.delete(`/events/categories/${categoryId}`);
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const handleOpenAddCategory = (eventId: string) => {
    setSelectedEventIdForCat(eventId);
    setIsAddCatModalOpen(true);
  };

  return {
    events,
    loading,
    refreshing,
    isAddCatModalOpen,
    setIsAddCatModalOpen,
    selectedEventIdForCat,
    fetchEvents,
    handleAdjustStock,
    handleDeleteCategory,
    handleOpenAddCategory,
  };
};
