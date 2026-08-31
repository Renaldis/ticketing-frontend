'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { EventItem } from '@/types';

export const useEventsCatalog = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const categoryParam = category !== 'ALL' ? `&category=${category}` : '';
      const res = await api.get(
        `/events?search=${search}&location=${location}${categoryParam}&sortBy=${sortBy}&limit=50`,
      );
      setEvents(res.data?.data?.events || []);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  }, [search, location, category, sortBy]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
  };

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setCategory('ALL');
    setSortBy('date');
  };

  return {
    events,
    search,
    setSearch,
    location,
    setLocation,
    category,
    setCategory,
    sortBy,
    setSortBy,
    loading,
    fetchEvents,
    handleSearchSubmit,
    handleCategorySelect,
    handleResetFilters,
  };
};
