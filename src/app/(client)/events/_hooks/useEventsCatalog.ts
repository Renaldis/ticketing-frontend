'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { EventItem } from '@/types';

export const useEventsCatalog = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events?search=${search}&location=${location}&sortBy=${sortBy}&limit=50`);
      setEvents(res.data?.data?.events || []);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  }, [search, location, sortBy]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setSortBy('date');
  };

  return {
    events,
    search,
    setSearch,
    location,
    setLocation,
    sortBy,
    setSortBy,
    loading,
    fetchEvents,
    handleSearchSubmit,
    handleResetFilters,
  };
};
