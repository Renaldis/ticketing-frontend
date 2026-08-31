'use client';

import React from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useAdminEvents } from './_hooks/useAdminEvents';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminEventCard } from './_components/AdminEventCard';
import { EventFormModal } from '@/components/admin/EventFormModal';

export default function AdminEventsPage() {
  const {
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
  } = useAdminEvents();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4cd7f6] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Event Catalog Management"
        subtitle="Manage active inventory, update concert schedules, and tier configurations"
        onOpenSidebar={() => {}}
        onRefresh={fetchEvents}
        refreshing={refreshing}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Live Concert Catalog ({events.length})</h2>
            <p className="text-xs text-[#908fa0]">Full CRUD inventory control</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="btn-primary text-[#003640] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Event</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <AdminEventCard
              key={evt.id}
              event={evt}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      </main>

      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEvents}
        initialData={editingEvent}
      />
    </>
  );
}
