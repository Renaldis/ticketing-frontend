'use client';

import React from 'react';
import { Search, MapPin, RotateCcw, Ticket, Flame, Dumbbell, GraduationCap, MonitorPlay, Palette, Sparkles } from 'lucide-react';
import { useEventsCatalog } from './_hooks/useEventsCatalog';
import { EventCard } from '../_components/EventCard';

const categoriesPills = [
  { key: 'ALL', label: 'All Experiences', icon: Sparkles },
  { key: 'CONCERT', label: 'Concert & Music', icon: Flame },
  { key: 'SPORTS', label: 'Sports & Marathon', icon: Dumbbell },
  { key: 'SEMINAR', label: 'Seminar & Summit', icon: GraduationCap },
  { key: 'WORKSHOP', label: 'Workshop & Class', icon: GraduationCap },
  { key: 'EXHIBITION', label: 'Exhibition & Expo', icon: Palette },
  { key: 'WEBINAR', label: 'Online Webinar', icon: MonitorPlay },
];

export default function EventsCatalogPage() {
  const {
    events,
    search,
    setSearch,
    location,
    setLocation,
    category,
    sortBy,
    setSortBy,
    loading,
    handleSearchSubmit,
    handleCategorySelect,
    handleResetFilters,
  } = useEventsCatalog();

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-12 space-y-10">
      {/* Header Title */}
      <div className="text-center sm:text-left space-y-2">
        <span className="text-xs font-extrabold text-[#4cd7f6] uppercase tracking-widest block">
          Universal Event Discovery
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Find Concerts, Marathons & Tech Summits
        </h1>
        <p className="text-sm text-[#908fa0]">
          Verified live ticket allocations protected by high-assurance atomic concurrency.
        </p>
      </div>

      {/* Category Filter Pills (Stitch Horizontal Scroller) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categoriesPills.map((pill) => {
          const Icon = pill.icon;
          const isSelected = category === pill.key;
          return (
            <button
              key={pill.key}
              onClick={() => handleCategorySelect(pill.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition duration-200 border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#03b5d3] to-[#4cd7f6] text-[#003640] border-transparent shadow-lg shadow-cyan-500/20 scale-105'
                  : 'bg-[#13131b] text-[#c7c4d7] border-[#464554]/40 hover:border-[#c0c1ff] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Location Filter Bar */}
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
            placeholder="Search by event title, organizer, topic..."
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

          {(search || location || category !== 'ALL' || sortBy !== 'date') && (
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
