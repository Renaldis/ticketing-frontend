'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminTickets } from './_hooks/useAdminTickets';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { EventTicketsCard } from './_components/EventTicketsCard';
import { AddCategoryModal } from '@/components/admin/AddCategoryModal';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export default function AdminTicketsPage() {
  const {
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
        title="Manajer Kategori Tiket & Kuota Stok"
        subtitle="Penambahan tier dinamis, alokasi kapasitas live, dan penyesuaian penambahan/pengurangan kuota"
        onOpenSidebar={() => {}}
        onRefresh={fetchEvents}
        refreshing={refreshing}
      />

      <main className="p-6 sm:p-10 space-y-8 flex-1">
        <div className="space-y-8">
          {events.map((evt) => (
            <EventTicketsCard
              key={evt.id}
              event={evt}
              onOpenAddCategory={handleOpenAddCategory}
              onAdjustStock={handleAdjustStock}
              onRequestDeleteCategory={setDeleteTargetCat}
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

      {/* SHADCN ALERT DIALOG: CONFIRM DELETE TICKET CATEGORY */}
      <AlertDialog
        open={!!deleteTargetCat}
        onOpenChange={(open) => !open && setDeleteTargetCat(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori Tiket Ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori tier <strong>&quot;{deleteTargetCat?.name}&quot;</strong> akan dihapus
              permanen. Pesanan yang sedang berjalan pada kategori ini mungkin akan terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteCategory}
              disabled={deleting}
              className="bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
            >
              {deleting ? 'Menghapus...' : 'Ya, Hapus Kategori'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
