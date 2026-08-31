'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { EventItem } from '@/types';

export const useAdminEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

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

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent({
      id: evt.id,
      title: evt.title,
      description: evt.description,
      location: evt.location,
      date: evt.date,
    });
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      await api.delete(`/events/${eventId}`);
      fetchEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  return {
    events,
    loading,
    refreshing,
    isModalOpen,
    setIsModalOpen,
    editingEvent,
    fetchEvents,
    handleOpenCreate,
    handleOpenEdit,
    handleDeleteEvent,
  };
};
