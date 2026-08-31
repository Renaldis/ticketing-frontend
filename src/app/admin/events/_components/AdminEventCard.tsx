import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Eye, Edit, Trash2 } from 'lucide-react';
import { EventItem } from '@/types';

interface AdminEventCardProps {
  event: EventItem;
  onEdit: (event: EventItem) => void;
  onRequestDelete: (event: { id: string; title: string }) => void;
}

export const AdminEventCard = ({ event, onEdit, onRequestDelete }: AdminEventCardProps) => {
  const totalStock = event.ticketCategories?.reduce((acc: number, c) => acc + c.totalCapacity, 0) || 0;
  const remainingStock =
    event.ticketCategories?.reduce((acc: number, c) => acc + c.remainingCapacity, 0) || 0;

  return (
    <div className="premium-card rounded-2xl overflow-hidden flex flex-col justify-between border border-[#464554]/30 hover:border-[#4cd7f6]/50 transition duration-300">
      <div className="relative h-48 bg-[#1f1f27]">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#464554] text-xs font-bold">
            No Poster Image
          </div>
        )}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold bg-[#13131b]/80 backdrop-blur-md text-[#4cd7f6] border border-[#464554]/40">
          {remainingStock} / {totalStock} Left
        </div>
      </div>

      <div className="p-5 flex-grow space-y-3">
        <h3 className="font-bold text-base text-white line-clamp-1">{event.title}</h3>
        <div className="space-y-1 text-xs text-[#c7c4d7]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#c0c1ff]" />
            <span>{new Date(event.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#464554]/30 flex flex-wrap gap-1.5">
          {event.ticketCategories?.map((cat) => (
            <span
              key={cat.id}
              className="px-2 py-0.5 rounded-md bg-[#13131b] border border-[#464554]/40 text-[10px] font-semibold text-[#c0c1ff]"
            >
              {cat.name} ({cat.remainingCapacity})
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#13131b] border-t border-[#464554]/30 flex items-center justify-between gap-2">
        <Link
          href={`/events/${event.slug || event.id}`}
          target="_blank"
          className="text-xs font-bold text-[#4cd7f6] hover:underline flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(event)}
            className="p-2 rounded-lg bg-[#1f1f27] hover:bg-[#292932] text-[#c0c1ff] hover:text-white transition"
            title="Edit Event"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRequestDelete({ id: event.id, title: event.title })}
            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
            title="Delete Event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
