import React from 'react';
import { Lock, ShieldCheck, AlertCircle, Loader2, Plus, Minus, Flame } from 'lucide-react';
import { EventItem, TicketCategory } from '@/types';

interface BookingCardProps {
  event: EventItem;
  categories: TicketCategory[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  activeCategory?: TicketCategory;
  subtotal: number;
  feePercent?: number;
  platformFee: number;
  grandTotal: number;
  isFree?: boolean;
  bookingLoading: boolean;
  error: string;
  onBooking: () => void;
}

export const BookingCard = ({
  event,
  categories,
  selectedCategory,
  setSelectedCategory,
  quantity,
  setQuantity,
  activeCategory,
  subtotal,
  feePercent = 2,
  platformFee,
  grandTotal,
  isFree = false,
  bookingLoading,
  error,
  onBooking,
}: BookingCardProps) => {
  const isEventEnded = new Date(event.date) < new Date();

  const currentActiveCat =
    categories.find((c: TicketCategory) => c.id === selectedCategory) || activeCategory;

  return (
    <div className="lg:col-span-4">
      <div className="premium-card rounded-2xl p-6 sm:p-7 sticky top-24 space-y-6 shadow-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-[#464554]/30">
          <h2 className="text-xl font-bold text-[#e4e1ed]">Pilih Kategori Tiket</h2>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
              isEventEnded
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-[#03b5d3]/10 border-[#03b5d3]/30 text-[#4cd7f6]'
            }`}
          >
            {!isEventEnded && (
              <Flame className="w-3 h-3 text-orange-400 fill-orange-400 animate-pulse" />
            )}
            <span>{isEventEnded ? 'Acara Selesai' : 'Live Quota'}</span>
          </span>
        </div>

        {isEventEnded && (
          <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>Penjualan ditutup. Jadwal acara ini telah berakhir.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          {categories.map((cat: TicketCategory) => {
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
                      ? 'border-[#4cd7f6] bg-[#03b5d3]/10 shadow-lg shadow-cyan-500/10'
                      : 'border-[#464554]/40 hover:border-[#464554] bg-[#13131b]'
                }`}
              >
                <div>
                  <h3 className="font-bold text-sm text-[#e4e1ed]">{cat.name}</h3>
                  <p className="text-xs text-[#c0c1ff] font-semibold mt-0.5">
                    {Number(cat.price) === 0
                      ? 'Gratis'
                      : `Rp ${Number(cat.price).toLocaleString('id-ID')}`}
                  </p>
                  <span className="text-[11px] text-[#908fa0] block mt-1">
                    {isSoldOut ? (
                      <span className="text-rose-400 font-bold">Habis Terjual</span>
                    ) : (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                        <span>Tersisa {cat.remainingCapacity} tiket</span>
                      </span>
                    )}
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
            <span>Subtotal ({quantity} tiket)</span>
            <span className="font-semibold text-[#e4e1ed]">
              {subtotal === 0 ? 'Gratis' : `Rp ${subtotal.toLocaleString('id-ID')}`}
            </span>
          </div>
          {!isFree && (
            <div className="flex justify-between">
              <span>Biaya Layanan Platform ({feePercent}%)</span>
              <span className="font-semibold text-[#e4e1ed]">
                Rp {platformFee.toLocaleString('id-ID')}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-[#464554]/30 text-sm">
            <span className="font-bold text-[#e4e1ed]">Total Pembayaran</span>
            <span className="font-extrabold text-[#4cd7f6] text-lg">
              {grandTotal === 0 ? 'Gratis' : `Rp ${grandTotal.toLocaleString('id-ID')}`}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBooking}
          disabled={
            isEventEnded ||
            bookingLoading ||
            !currentActiveCat ||
            currentActiveCat.remainingCapacity <= 0
          }
          className="btn-primary w-full text-[#003640] font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40"
        >
          {isEventEnded ? (
            <span>Acara Telah Berakhir</span>
          ) : bookingLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#003640]" />
              <span>Memproses Pesanan...</span>
            </>
          ) : isFree ? (
            <span>Klaim Tiket Gratis Sekarang</span>
          ) : (
            <span>Pesan Tiket Sekarang</span>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 text-xs text-[#908fa0] pt-2">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terenkripsi</span>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Terproteksi Kunci Idempotensi</span>
          </span>
        </div>
      </div>
    </div>
  );
};
