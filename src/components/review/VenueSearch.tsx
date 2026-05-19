'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { GooglePlace } from '@/types';

interface VenueSearchProps {
  onSelect: (place: GooglePlace) => void;
}

export function VenueSearch({ onSelect }: VenueSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GooglePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async () => {
    if (query.trim().length < 2) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/venues/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.places ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="Search restaurant, café, hotel..."
          className="flex-1 h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none text-base"
        />
        <button
          onClick={search}
          disabled={loading || query.trim().length < 2}
          className="h-12 px-5 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-50 hover:bg-gray-700 transition-colors"
        >
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {searched && results.length === 0 && !loading && (
        <p className="text-center text-gray-500 text-sm">No results found. Try a different search.</p>
      )}

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map(place => (
            <li key={place.placeId}>
              <button
                onClick={() => onSelect(place)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all'
                )}
              >
                <div className="font-semibold text-gray-900">{place.name}</div>
                <div className="text-sm text-gray-500 mt-0.5">{place.address}</div>
                {place.rating && (
                  <div className="text-sm text-yellow-600 mt-1">★ {place.rating.toFixed(1)}</div>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
