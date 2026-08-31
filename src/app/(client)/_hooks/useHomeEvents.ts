'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { EventItem } from '@/types';

export const useHomeEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async (query = '', loc = '') => {
    setIsLoading(true);
    try {
      const res = await api.get(`/events?search=${query}&location=${loc}&limit=20`);
      setEvents(res.data?.data?.events || []);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents(search, location);
  };

  return {
    events,
    search,
    setSearch,
    location,
    setLocation,
    isLoading,
    fetchEvents,
    handleSearch,
  };
};
