'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEventDetail } from './_hooks/useEventDetail';
import { EventInfo } from './_components/EventInfo';
import { BookingCard } from './_components/BookingCard';

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slugOrId = resolvedParams.slug;

  const {
    event,
    selectedCategory,
    setSelectedCategory,
    quantity,
    setQuantity,
    loading,
    bookingLoading,
    error,
    activeCategory,
    subtotal,
    platformFee,
    grandTotal,
    handleBooking,
  } = useEventDetail(slugOrId);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4cd7f6] animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
        <Link href="/events" className="text-[#c0c1ff] hover:underline text-sm inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-10">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#c7c4d7] hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-4 h-4 text-[#4cd7f6]" />
        <span>Back to Events</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <EventInfo event={event} />
        <BookingCard
          event={event}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          quantity={quantity}
          setQuantity={setQuantity}
          activeCategory={activeCategory}
          subtotal={subtotal}
          platformFee={platformFee}
          grandTotal={grandTotal}
          bookingLoading={bookingLoading}
          error={error}
          onBooking={handleBooking}
        />
      </div>
    </main>
  );
}
