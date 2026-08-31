'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCategorySchema, AddCategoryFormData } from '@/schemas';
import { X, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

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

  if (!isOpen) return null;

  const onSubmit = async (data: AddCategoryFormData) => {
    setSubmitting(true);
    setServerError('');

    try {
      await api.post(`/events/${eventId}/categories`, {
        name: data.name,
        price: Number(data.price),
        capacity: Number(data.capacity),
      });

      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to add category tier');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="premium-card rounded-2xl max-w-md w-full p-7 space-y-5 shadow-2xl relative">
        <div className="flex justify-between items-center pb-3 border-b border-[#464554]/30">
          <h3 className="text-lg font-bold text-white">Add Ticket Category Tier</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-[#908fa0] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#908fa0] uppercase font-bold mb-1">Category Tier Name</label>
            <input
              {...register('name')}
              placeholder="e.g. VIP Pass, Early Bird"
              className="input-glass w-full rounded-xl px-3.5 py-2.5 text-sm text-white"
            />
            {errors.name && <p className="text-rose-400 text-[11px] mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[#908fa0] uppercase font-bold mb-1">Price (IDR)</label>
            <input
              type="number"
              {...register('price')}
              placeholder="1500000"
              className="input-glass w-full rounded-xl px-3.5 py-2.5 text-sm text-white"
            />
            {errors.price && <p className="text-rose-400 text-[11px] mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-[#908fa0] uppercase font-bold mb-1">Total Capacity Seats</label>
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-1/2 py-2.5 rounded-xl text-[#003640] font-bold disabled:opacity-40"
            >
              {submitting ? 'Adding...' : 'Add Tier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
