'use client';

import { useState } from 'react';
import { VenueSearch } from '@/components/review/VenueSearch';
import { ReviewFlow } from '@/components/review/ReviewFlow';
import type { GooglePlace } from '@/types';

export default function HomePage() {
  const [selectedPlace, setSelectedPlace] = useState<GooglePlace | null>(null);

  if (selectedPlace) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => setSelectedPlace(null)}
            className="text-sm text-gray-500 hover:text-gray-900 mb-8 flex items-center gap-1"
          >
            ← Change location
          </button>
          <ReviewFlow
            venueName={selectedPlace.name}
            venueCategory={selectedPlace.category}
            googleReviewUrl={selectedPlace.reviewUrl}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave a review</h1>
          <p className="text-gray-500 mt-2">Search for the place you visited</p>
        </div>
        <VenueSearch onSelect={setSelectedPlace} />
      </div>
    </main>
  );
}
