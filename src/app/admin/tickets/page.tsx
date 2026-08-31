'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminTickets } from './_hooks/useAdminTickets';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { EventTicketsCard } from './_components/EventTicketsCard';
import { AddCategoryModal } from '@/components/admin/AddCategoryModal';

export default function AdminTicketsPage() {
  const {
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
  } = useAdminTickets();

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
        title="Ticket Categories & Stock Manager"
        subtitle="Dynamic tier additions, live capacity allocations, and atomic increment adjustments"
        onOpenSidebar={() => {}}
        onRefresh={fetchEvents}
        refreshing={refreshing}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1 overflow-y-auto">
        <div className="space-y-8">
          {events.map((evt) => (
            <EventTicketsCard
              key={evt.id}
              event={evt}
              onOpenAddCategory={handleOpenAddCategory}
              onAdjustStock={handleAdjustStock}
              onDeleteCategory={handleDeleteCategory}
            />
          ))}
        </div>
      </main>

      <AddCategoryModal
        isOpen={isAddCatModalOpen}
        onClose={() => setIsAddCatModalOpen(false)}
        onSuccess={fetchEvents}
        eventId={selectedEventIdForCat}
      />
    </>
  );
}
