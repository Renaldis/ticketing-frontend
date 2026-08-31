'use client';

import React from 'react';
import { ArrowRight, Search, MapPin } from 'lucide-react';
import Link from 'next/link';

interface HeroSectionProps {
  search: string;
  setSearch: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const HeroSection = ({
  search,
  setSearch,
  location,
  setLocation,
  onSearch,
}: HeroSectionProps) => {
  return (
    <section className="relative w-full pt-20 pb-28 px-6 sm:px-12 hero-bg flex flex-col items-center text-center overflow-hidden">
      <div className="ambient-glow top-0 left-1/4"></div>
      <div
        className="ambient-glow top-20 right-1/4"
        style={{
          background: 'radial-gradient(circle, rgba(76,215,246,0.15) 0%, rgba(19,19,27,0) 70%)',
        }}
      ></div>

      <div className="max-w-4xl mx-auto z-10 space-y-8">
        <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold leading-tight text-[#e4e1ed] tracking-tight">
          Experience Live Events.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4cd7f6] to-[#c0c1ff]">
            Zero Booking Friction.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#c7c4d7] max-w-2xl mx-auto font-normal leading-relaxed">
          Discover premium events, secure your tickets with cryptographic certainty, and access your
          digital pass instantly. The next generation of ticketing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/events"
            className="btn-primary text-[#003640] font-bold text-sm px-8 py-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/my-orders"
            className="btn-secondary text-[#c0c1ff] font-bold text-sm px-8 py-3.5 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <span>View My Tickets</span>
          </Link>
        </div>
      </div>

      <form
        onSubmit={onSearch}
        className="w-full max-w-3xl mx-auto mt-14 glass-panel rounded-2xl p-2.5 flex flex-col md:flex-row gap-2 z-20 shadow-2xl"
      >
        <div className="flex-grow flex items-center px-4 py-3 bg-[#13131b] rounded-xl border border-[#464554]/40">
          <Search className="w-5 h-5 text-[#908fa0] mr-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for artists, venues, or events..."
            className="w-full bg-transparent border-none text-[#e4e1ed] focus:outline-none placeholder-[#908fa0] text-sm"
          />
        </div>

        <div className="flex-grow md:flex-grow-0 flex items-center px-4 py-3 bg-[#13131b] rounded-xl border border-[#464554]/40 md:w-52">
          <MapPin className="w-5 h-5 text-[#908fa0] mr-3" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full bg-transparent border-none text-[#e4e1ed] focus:outline-none placeholder-[#908fa0] text-sm"
          />
        </div>

        <button
          type="submit"
          className="btn-primary text-[#003640] rounded-xl px-8 py-3 font-bold text-sm flex items-center justify-center"
        >
          Search
        </button>
      </form>
    </section>
  );
};
