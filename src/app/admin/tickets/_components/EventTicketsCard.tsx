import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { EventItem } from '@/types';

interface EventTicketsCardProps {
  event: EventItem;
  onOpenAddCategory: (eventId: string) => void;
  onAdjustStock: (categoryId: string, delta: number) => void;
  onRequestDeleteCategory: (category: { id: string; name: string }) => void;
}

export const EventTicketsCard = ({
  event,
  onOpenAddCategory,
  onAdjustStock,
  onRequestDeleteCategory,
}: EventTicketsCardProps) => {
  return (
    <div className="premium-card rounded-2xl p-6 sm:p-8 space-y-5 border border-[#464554]/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#464554]/30">
        <div>
          <h3 className="font-extrabold text-lg text-white">{event.title}</h3>
          <span className="text-xs text-[#908fa0]">{event.location}</span>
        </div>

        <button
          onClick={() => onOpenAddCategory(event.id)}
          className="btn-secondary text-[#4cd7f6] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tier Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {event.ticketCategories?.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#13131b] border border-[#464554]/40 rounded-xl p-5 flex flex-col justify-between gap-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-sm text-[#e4e1ed]">{cat.name}</span>
                <span className="text-xs font-extrabold text-[#c0c1ff] block mt-0.5">
                  Rp {Number(cat.price).toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={() => onRequestDeleteCategory({ id: cat.id, name: cat.name })}
                className="p-1.5 text-[#908fa0] hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-3 border-t border-[#464554]/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#908fa0] block font-bold uppercase">
                  Live Capacity
                </span>
                <span className="text-xs font-black text-emerald-400">
                  {cat.remainingCapacity} / {cat.totalCapacity}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onAdjustStock(cat.id, -5)}
                  disabled={cat.remainingCapacity < 5}
                  className="px-2.5 py-1 rounded-lg bg-[#1f1f27] hover:bg-[#292932] text-xs font-bold text-rose-400 disabled:opacity-30 transition"
                  title="Kurangi stok sebanyak 5"
                >
                  -5
                </button>
                <button
                  onClick={() => onAdjustStock(cat.id, -1)}
                  disabled={cat.remainingCapacity < 1}
                  className="px-2.5 py-1 rounded-lg bg-[#1f1f27] hover:bg-[#292932] text-xs font-bold text-rose-400 disabled:opacity-30 transition"
                  title="Kurangi stok sebanyak 1"
                >
                  -1
                </button>
                <button
                  onClick={() => onAdjustStock(cat.id, 1)}
                  className="px-2.5 py-1 rounded-lg bg-[#1f1f27] hover:bg-[#292932] text-xs font-bold text-[#4cd7f6] transition"
                  title="Tambah stok sebanyak 1"
                >
                  +1
                </button>
                <button
                  onClick={() => onAdjustStock(cat.id, 10)}
                  className="px-2.5 py-1 rounded-lg bg-[#1f1f27] hover:bg-[#292932] text-xs font-bold text-[#4cd7f6] transition"
                  title="Tambah stok sebanyak 10"
                >
                  +10
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
