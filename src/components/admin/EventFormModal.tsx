'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, EventFormData } from '@/schemas';
import { Plus, Trash2, X, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
  } | null;
}

export const EventFormModal = ({ isOpen, onClose, onSuccess, initialData }: EventModalProps) => {
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const isEdit = !!initialData;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          location: initialData.location,
          date: new Date(new Date(initialData.date).getTime() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16),
          categories: [{ name: 'VIP Pass', price: 1500000, capacity: 50 }],
        }
      : {
          title: '',
          description: '',
          location: '',
          date: '',
          categories: [
            { name: 'VIP Pass', price: 1500000, capacity: 50 },
            { name: 'Regular Festival', price: 500000, capacity: 200 },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  });

  if (!isOpen) return null;

  const onSubmit = async (data: EventFormData) => {
    setSubmitting(true);
    setServerError('');

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('location', data.location);
      formData.append('date', new Date(data.date).toISOString());
      formData.append(
        'categories',
        JSON.stringify(
          data.categories.map((c) => ({
            name: c.name,
            price: Number(c.price),
            capacity: Number(c.capacity),
          })),
        ),
      );
      if (posterFile) {
        formData.append('image', posterFile);
      }

      if (isEdit && initialData) {
        await api.put(`/events/${initialData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="premium-card rounded-2xl max-w-xl w-full p-7 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-[#464554]/30">
          <h3 className="text-xl font-bold text-white">{isEdit ? 'Edit Event Details' : 'Create New Event'}</h3>
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
            <label className="block text-[#908fa0] uppercase font-bold mb-1">Event Title</label>
            <input
              {...register('title')}
              placeholder="e.g. Jakarta Rock Live 2026"
              className="input-glass w-full rounded-xl px-3.5 py-2.5 text-sm text-white"
            />
            {errors.title && <p className="text-rose-400 text-[11px] mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-[#908fa0] uppercase font-bold mb-1">Description (HTML / Text)</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="<p>Full festival experience with international headliners.</p>"
              className="input-glass w-full rounded-xl px-3.5 py-2.5 text-xs text-white"
            ></textarea>
            {errors.description && (
              <p className="text-rose-400 text-[11px] mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#908fa0] uppercase font-bold mb-1">Location Venue</label>
              <input
                {...register('location')}
                placeholder="GBK Stadium, Jakarta"
                className="input-glass w-full rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
              {errors.location && <p className="text-rose-400 text-[11px] mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-[#908fa0] uppercase font-bold mb-1">Date & Time</label>
              <input
                type="datetime-local"
                {...register('date')}
                className="input-glass w-full rounded-xl px-3.5 py-2.5 text-xs text-white"
              />
              {errors.date && <p className="text-rose-400 text-[11px] mt-1">{errors.date.message}</p>}
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-[#908fa0] uppercase font-bold text-[11px]">
                    Ticket Categories & Tiers
                  </label>
                  <span className="text-[10px] text-[#908fa0]">Set tier name, price, and initial capacity</span>
                </div>

                <button
                  type="button"
                  onClick={() => append({ name: '', price: 500000, capacity: 100 })}
                  className="text-xs text-[#4cd7f6] hover:text-white font-bold flex items-center gap-1 bg-[#1f1f27] px-2.5 py-1 rounded-lg border border-[#464554]/40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tier</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-[#13131b] border border-[#464554]/40 rounded-xl p-3 grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-5">
                      <label className="text-[9px] text-[#908fa0] font-bold block uppercase">Tier Name</label>
                      <input
                        {...register(`categories.${index}.name` as const)}
                        placeholder="VIP / Regular"
                        className="input-glass w-full rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="col-span-4">
                      <label className="text-[9px] text-[#908fa0] font-bold block uppercase">Price (IDR)</label>
                      <input
                        type="number"
                        {...register(`categories.${index}.price` as const)}
                        placeholder="1000000"
                        className="input-glass w-full rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-[9px] text-[#908fa0] font-bold block uppercase">Seats</label>
                      <input
                        type="number"
                        {...register(`categories.${index}.capacity` as const)}
                        placeholder="50"
                        className="input-glass w-full rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div className="col-span-1 flex items-end justify-center pt-3">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        className="p-1 text-[#908fa0] hover:text-rose-400 rounded-lg hover:bg-rose-500/10 disabled:opacity-20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-[#908fa0] uppercase font-bold mb-1">
              Event Poster Image {isEdit ? '(Optional)' : ''}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
              className="input-glass w-full rounded-xl px-3 py-2 text-xs text-white"
            />
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
              {submitting ? 'Saving...' : isEdit ? 'Update Event' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
