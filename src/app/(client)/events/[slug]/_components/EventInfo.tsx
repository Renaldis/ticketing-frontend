import React from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { EventItem } from '@/types';

export const EventInfo = ({ event }: { event: EventItem }) => {
  return (
    <div className="lg:col-span-8 space-y-8">
      <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden shadow-2xl bg-[#1f1f27]">
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#13131b] via-[#1f1f27] to-[#13131b]">
            <Ticket className="w-20 h-20 text-[#464554]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#13131b] via-transparent to-transparent opacity-80"></div>
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 rounded-full glass-panel text-[#4cd7f6] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            Concert Experience
          </span>
        </div>
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#e4e1ed] tracking-tight mb-6">
          {event.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-[#464554]/30">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#c0c1ff]" />
            <div>
              <span className="text-xs text-[#908fa0] uppercase font-bold block">Event Date</span>
              <span className="text-sm font-semibold text-white">
                {new Date(event.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-rose-400" />
            <div>
              <span className="text-xs text-[#908fa0] uppercase font-bold block">Venue</span>
              <span className="text-sm font-semibold text-white">{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">About The Event</h2>
        <div
          className="text-[#c7c4d7] text-sm leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: event.description || 'No description provided.' }}
        />
      </div>
    </div>
  );
};
