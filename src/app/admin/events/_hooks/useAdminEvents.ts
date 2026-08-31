'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { EventItem } from '@/types';
import { toast } from 'sonner';

export const useAdminEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // State Delete Confirm Dialog
  const [deleteTargetEvent, setDeleteTargetEvent] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/events?limit=100');
      setEvents(res.data?.data?.events || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat daftar event.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent({
      id: evt.id,
      title: evt.title,
      description: evt.description,
      category: evt.category,
      location: evt.location,
      date: evt.date,
    });
    setIsModalOpen(true);
  };

  const handleConfirmDeleteEvent = async () => {
    if (!deleteTargetEvent) return;
    setDeleting(true);

    try {
      await api.delete(`/events/${deleteTargetEvent.id}`);
      toast.success(`Event "${deleteTargetEvent.title}" berhasil dihapus.`);
      setDeleteTargetEvent(null);
      fetchEvents();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menghapus event.');
    } finally {
      setDeleting(false);
    }
  };

  return {
    events,
    loading,
    refreshing,
    isModalOpen,
    setIsModalOpen,
    editingEvent,
    deleteTargetEvent,
    setDeleteTargetEvent,
    deleting,
    fetchEvents,
    handleOpenCreate,
    handleOpenEdit,
    handleConfirmDeleteEvent,
  };
};
