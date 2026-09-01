'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCategorySchema, AddCategoryFormData } from '@/schemas';
import { AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventId: string;
}

export const AddCategoryModal = ({ isOpen, onClose, onSuccess, eventId }: AddCategoryModalProps) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategorySchema),
  });

  const onSubmit = async (data: AddCategoryFormData) => {
    setSubmitting(true);
    setServerError('');

    try {
      await api.post(`/events/${eventId}/categories`, {
        name: data.name,
        price: Number(data.price),
        capacity: Number(data.capacity),
      });

      toast.success(`Kategori tier "${data.name}" berhasil ditambahkan!`);
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Gagal menambahkan kategori tier');
      toast.error('Gagal menambahkan kategori tier.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Kategori Tiket Tier Baru</DialogTitle>
        </DialogHeader>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#908fa0] uppercase font-bold mb-1">Nama Kategori Tier</label>
            <input
              {...register('name')}
              placeholder="contoh: VIP Pass, Early Bird, Reguler"
              className="input-glass w-full rounded-xl px-3.5 py-2.5 text-sm text-white"
            />
            {errors.name && <p className="text-rose-400 text-[11px] mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[#908fa0] uppercase font-bold mb-1">Harga Tiket (IDR)</label>
            <input
              type="number"
              {...register('price')}
              placeholder="1500000"
              className="input-glass w-full rounded-xl px-3.5 py-2.5 text-sm text-white"
            />
            {errors.price && <p className="text-rose-400 text-[11px] mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-[#908fa0] uppercase font-bold mb-1">Kapasitas Kuota Tiket</label>
            <input
              type="number"
              {...register('capacity')}
              placeholder="100"
              className="input-glass w-full rounded-xl px-3.5 py-2.5 text-sm text-white"
            />
            {errors.capacity && <p className="text-rose-400 text-[11px] mt-1">{errors.capacity.message}</p>}
          </div>

          <div className="flex gap-3 pt-3 border-t border-[#464554]/30">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary w-1/2 py-2.5 rounded-xl text-white font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-1/2 py-2.5 rounded-xl text-[#003640] font-bold disabled:opacity-40"
            >
              {submitting ? 'Menambahkan...' : 'Simpan Kategori'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
