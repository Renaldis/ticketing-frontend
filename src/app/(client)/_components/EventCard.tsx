import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { EventItem } from '@/types';

export const EventCard = ({ event }: { event: EventItem }) => {
  const lowestPrice = event.ticketCategories?.length
    ? Math.min(...event.ticketCategories.map((c) => Number(c.price)))
    : null;
  const totalRemaining = event.ticketCategories?.reduce((acc, c) => acc + c.remainingCapacity, 0) || 0;
  const eventDate = new Date(event.date);

  // Gunakan SLUG jika tersedia, fallback ke ID
  const eventPath = `/events/${event.slug || event.id}`;

  return (
    <Link
      href={eventPath}
      className="premium-card rounded-2xl overflow-hidden group cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-52 w-full overflow-hidden bg-[#1f1f27]">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#13131b] via-[#1f1f27] to-[#13131b]">
            <span className="text-[#464554] text-xs font-bold uppercase tracking-widest">No Poster Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f27] via-transparent to-transparent opacity-80"></div>

        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 rounded-full glass-panel text-[#4cd7f6] text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
            Concert
          </span>
        </div>

        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[#1f1f27]/85 backdrop-blur-md text-[#e4e1ed] border border-[#464554]/40 text-center flex flex-col">
          <span className="text-[10px] text-[#c7c4d7] uppercase font-bold">
            {eventDate.toLocaleString('en-US', { month: 'short' })}
          </span>
          <span className="font-extrabold text-lg leading-none">{eventDate.getDate()}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#e4e1ed] mb-2 group-hover:text-[#4cd7f6] transition-colors line-clamp-1">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[#c7c4d7] text-xs mb-6">
          <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-[#464554]/30 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#908fa0]">Starting from</span>
            <span className="text-base text-[#e4e1ed] font-extrabold">
              {lowestPrice ? `Rp ${lowestPrice.toLocaleString('id-ID')}` : 'Free'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {totalRemaining > 0 ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab] pulse-dot"></span>
                <span className="text-xs text-[#ffb4ab] font-bold">{totalRemaining} Tickets Left</span>
              </>
            ) : (
              <span className="text-xs text-[#908fa0] font-bold px-2.5 py-0.5 rounded-full bg-[#292932]">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
