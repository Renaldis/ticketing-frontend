'use client';

import React from 'react';
import { ArrowRight, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useHomeEvents } from './_hooks/useHomeEvents';
import { HeroSection } from './_components/HeroSection';
import { FeatureBento } from './_components/FeatureBento';
import { EventCard } from './_components/EventCard';

export default function HomePage() {
  const { events, search, setSearch, location, setLocation, isLoading, handleSearch } =
    useHomeEvents();

  return (
    <main className="flex-grow w-full relative z-10 bg-grid">
      <HeroSection
        search={search}
        setSearch={setSearch}
        location={location}
        setLocation={setLocation}
        onSearch={handleSearch}
      />

      <FeatureBento />

      {/* Upcoming Events Grid */}
      <section
        id="upcoming-events"
        className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16 relative z-10"
      >
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl text-[#e4e1ed] font-extrabold leading-tight">
              Event Mendatang Pilihan
            </h2>
            <p className="text-sm text-[#c7c4d7] mt-2">
              Pengalaman langsung pilihan yang akan segera hadir.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden md:flex items-center gap-2 text-[#c0c1ff] font-bold text-sm hover:text-[#4cd7f6] transition-colors"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="premium-card rounded-2xl p-4 animate-pulse h-96"></div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-2">Belum Ada Event Ditemukan</h3>
            <p className="text-sm text-[#908fa0]">
              Coba sesuaikan kata kunci pencarian atau filter lokasi Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 py-20 relative z-10">
        <div className="glass-panel rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden border-[#c0c1ff]/20">
          <div className="absolute inset-0 bg-gradient-to-r from-[#c0c1ff]/10 via-transparent to-[#4cd7f6]/10 pointer-events-none"></div>
          <h2 className="text-3xl sm:text-4xl text-[#e4e1ed] font-extrabold mb-4 relative z-10">
            Siap Mengadakan Event Anda Sendiri?
          </h2>
          <p className="text-base text-[#c7c4d7] max-w-2xl mx-auto mb-8 relative z-10">
            Bergabunglah bersama penyelenggara event profesional menggunakan infrastruktur TICKETIX untuk mengelola tiket, kontrol akses pintu gerbang, dan laporan keuangan real-time.
          </p>
          <Link
            href="/login"
            className="btn-primary text-[#003640] font-bold text-sm px-8 py-3.5 rounded-xl relative z-10 inline-flex items-center gap-2"
          >
            <span>Daftar Sebagai Penyelenggara</span>
            <Rocket className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
