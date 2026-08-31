import React from 'react';
import { Lock, ShieldCheck, AlertCircle, Loader2, Plus, Minus } from 'lucide-react';
import { EventItem, TicketCategory } from '@/types';

interface BookingCardProps {
  event: EventItem;
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  activeCategory?: TicketCategory;
  subtotal: number;
  platformFee: number;
  grandTotal: number;
  bookingLoading: boolean;
  error: string;
  onBooking: () => void;
}

export const BookingCard = ({
  event,
  selectedCategory,
  setSelectedCategory,
  quantity,
  setQuantity,
  activeCategory,
  subtotal,
  platformFee,
  grandTotal,
  bookingLoading,
  error,
  onBooking,
}: BookingCardProps) => {
  return (
    <div className="lg:col-span-4">
      <div className="premium-card rounded-2xl p-6 sm:p-7 sticky top-24 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-[#464554]/30">
          <h2 className="text-xl font-bold text-[#e4e1ed]">Select Tickets</h2>
          <span className="text-xs font-bold text-[#4cd7f6] px-2.5 py-1 rounded-full bg-[#03b5d3]/10 border border-[#03b5d3]/30">
            Live Availability
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          {event.ticketCategories.map((cat: TicketCategory) => {
            const isSoldOut = cat.remainingCapacity <= 0;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => !isSoldOut && setSelectedCategory(cat.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSoldOut
                    ? 'opacity-40 border-[#464554]/40 bg-[#13131b] cursor-not-allowed'
                    : isSelected
                      ? 'border-[#4cd7f6] bg-[#03b5d3]/10'
                      : 'border-[#464554]/40 hover:border-[#464554] bg-[#13131b]'
                }`}
              >
                <div>
                  <h3 className="font-bold text-sm text-[#e4e1ed]">{cat.name}</h3>
                  <p className="text-xs text-[#c0c1ff] font-semibold mt-0.5">
                    Rp {Number(cat.price).toLocaleString('id-ID')}
                  </p>
                  <span className="text-[11px] text-[#908fa0] block mt-1">
                    {isSoldOut ? 'Sold Out' : `Only ${cat.remainingCapacity} left`}
                  </span>
                </div>

                {isSelected && !isSoldOut && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 bg-[#1f1f27] border border-[#464554]/40 rounded-lg p-1"
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded bg-[#292932] text-white flex items-center justify-center hover:bg-[#34343d]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(cat.remainingCapacity, q + 1))}
                      disabled={quantity >= cat.remainingCapacity}
                      className="w-7 h-7 rounded bg-[#292932] text-white flex items-center justify-center hover:bg-[#34343d] disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[#464554]/30 space-y-2 text-xs text-[#c7c4d7]">
          <div className="flex justify-between">
            <span>Subtotal ({quantity} items)</span>
            <span className="font-semibold text-[#e4e1ed]">
              Rp {subtotal.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee (2%)</span>
            <span className="font-semibold text-[#e4e1ed]">
              Rp {platformFee.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-[#464554]/30 text-sm">
            <span className="font-bold text-[#e4e1ed]">Total</span>
            <span className="font-extrabold text-[#4cd7f6] text-lg">
              Rp {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBooking}
          disabled={bookingLoading || !activeCategory || activeCategory.remainingCapacity <= 0}
          className="btn-primary w-full text-[#003640] font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {bookingLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#003640]" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Book Tickets</span>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 text-xs text-[#908fa0] pt-2">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted</span>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Verified</span>
          </span>
        </div>
      </div>
    </div>
  );
};
