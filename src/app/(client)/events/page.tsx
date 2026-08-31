'use client';

import React from 'react';
import { Search, MapPin, Filter, RotateCcw, Ticket, Loader2 } from 'lucide-react';
import { useEventsCatalog } from './_hooks/useEventsCatalog';
import { EventCard } from '../_components/EventCard';

export default function EventsCatalogPage() {
  const {
    events,
    search,
    setSearch,
    location,
    setLocation,
    sortBy,
    setSortBy,
    loading,
    handleSearchSubmit,
    handleResetFilters,
  } = useEventsCatalog();

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-12 space-y-12">
      {/* Header Title */}
      <div className="text-center sm:text-left space-y-2">
        <span className="text-xs font-extrabold text-[#4cd7f6] uppercase tracking-widest block">
          Discovery Hub
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Explore Live Events & Concerts
        </h1>
        <p className="text-sm text-[#908fa0]">
          Filter and browse upcoming experiences with verified real-time seat availability.
        </p>
      </div>

      {/* Filter & Search Bar Toolbar */}
      <form
        onSubmit={handleSearchSubmit}
        className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3 shadow-xl"
      >
        <div className="flex-grow flex items-center px-4 py-2.5 bg-[#13131b] rounded-xl border border-[#464554]/40 w-full">
          <Search className="w-4 h-4 text-[#908fa0] mr-2.5 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event title, genre..."
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-[#908fa0]"
          />
        </div>

        <div className="flex-grow md:flex-grow-0 flex items-center px-4 py-2.5 bg-[#13131b] rounded-xl border border-[#464554]/40 w-full md:w-56">
          <MapPin className="w-4 h-4 text-[#908fa0] mr-2.5 flex-shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City / Venue"
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-[#908fa0]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-glass text-xs text-white rounded-xl px-4 py-3 font-bold focus:outline-none w-full md:w-auto"
          >
            <option value="date" className="bg-[#13131b]">Date: Upcoming</option>
            <option value="title" className="bg-[#13131b]">Title: A-Z</option>
            <option value="createdAt" className="bg-[#13131b]">Newly Added</option>
          </select>

          <button
            type="submit"
            className="btn-primary text-[#003640] font-bold text-xs px-6 py-3 rounded-xl flex-shrink-0"
          >
            Filter
          </button>

          {(search || location || sortBy !== 'date') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-3 rounded-xl bg-[#1f1f27] hover:bg-[#292932] text-[#908fa0] hover:text-white transition"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Events Results Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[#c7c4d7]">
            Showing <span className="text-white font-extrabold">{events.length}</span> live events
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="premium-card rounded-2xl p-4 animate-pulse h-96"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-3xl">
            <Ticket className="w-12 h-12 text-[#908fa0] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">No Matching Events Found</h3>
            <p className="text-xs text-[#908fa0] mb-6">Try broadening your search or resetting filter parameters.</p>
            <button
              onClick={handleResetFilters}
              className="btn-secondary text-[#c0c1ff] px-6 py-2.5 rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
