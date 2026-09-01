'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useAdminUsers = () => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'ATTENDEES'>('USERS');

  // Tab 1: Users State
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUserAudit, setSelectedUserAudit] = useState<any>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  // Tab 2: Event Attendees State
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [attendeesData, setAttendeesData] = useState<any>(null);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Fetch Users List
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get(`/admin/users?search=${encodeURIComponent(userSearch)}&limit=100`);
      setUsers(res.data?.data?.users || []);
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengambil daftar pengguna.');
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch]);

  // Fetch Events for Picker
  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get('/events?limit=100&upcomingOnly=false');
      const list = res.data?.data?.events || [];
      setEventsList(list);
      if (list.length > 0 && !selectedEventId) {
        setSelectedEventId(list[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectedEventId]);

  // Fetch Attendees for Selected Event
  const fetchAttendees = useCallback(async () => {
    if (!selectedEventId) return;
    setLoadingAttendees(true);
    try {
      const res = await api.get(
        `/admin/events/${selectedEventId}/attendees?search=${encodeURIComponent(attendeeSearch)}&status=${statusFilter}`,
      );
      setAttendeesData(res.data?.data);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memuat audit transparansi peserta event.');
    } finally {
      setLoadingAttendees(false);
    }
  }, [selectedEventId, attendeeSearch, statusFilter]);

  // Load User Audit Detail Modal
  const handleOpenUserAudit = async (userId: string) => {
    setAuditLoading(true);
    try {
      const res = await api.get(`/admin/users/${userId}/audit`);
      setSelectedUserAudit(res.data?.data);
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengambil audit tiket pengguna.');
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'USERS') {
        fetchUsers();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers, activeTab]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'ATTENDEES' && selectedEventId) {
        fetchAttendees();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchAttendees, activeTab, selectedEventId]);

  return {
    activeTab,
    setActiveTab,
    users,
    userSearch,
    setUserSearch,
    loadingUsers,
    selectedUserAudit,
    setSelectedUserAudit,
    auditLoading,
    handleOpenUserAudit,
    eventsList,
    selectedEventId,
    setSelectedEventId,
    attendeeSearch,
    setAttendeeSearch,
    statusFilter,
    setStatusFilter,
    attendeesData,
    loadingAttendees,
  };
};
