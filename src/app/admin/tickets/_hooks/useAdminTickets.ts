'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { EventItem } from '@/types';
import { toast } from 'sonner';

export const useAdminTickets = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [selectedEventIdForCat, setSelectedEventIdForCat] = useState<string>('');

  // Delete Category Confirm Dialog State
  const [deleteTargetCat, setDeleteTargetCat] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/events?limit=100');
      setEvents(res.data?.data?.events || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat kategori tiket.');
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
      toast.success(`Stok berhasil ${delta > 0 ? `ditambah +${delta}` : `dikurangi ${delta}`}`);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyesuaikan kuota stok.');
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteTargetCat) return;
    setDeleting(true);

    try {
      await api.delete(`/events/categories/${deleteTargetCat.id}`);
      toast.success(`Kategori "${deleteTargetCat.name}" berhasil dihapus.`);
      setDeleteTargetCat(null);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menghapus kategori.');
    } finally {
      setDeleting(false);
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
    deleteTargetCat,
    setDeleteTargetCat,
    deleting,
    fetchEvents,
    handleAdjustStock,
    handleConfirmDeleteCategory,
    handleOpenAddCategory,
  };
};
