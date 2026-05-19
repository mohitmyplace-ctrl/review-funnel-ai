'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { STAR_LABELS } from '@/lib/review-engine';
import type { StarRating } from '@/types';

interface StarPickerProps {
  value: StarRating | null;
  onChange: (rating: StarRating) => void;
}

export function StarPicker({ value, onChange }: StarPickerProps) {
  const [hovered, setHovered] = useState<StarRating | null>(null);

  const display = hovered ?? value;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2" role="group" aria-label="Star rating">
        {([1, 2, 3, 4, 5] as StarRating[]).map(star => (
          <button
            key={star}
            type="button"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'text-4xl transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded',
              display !== null && star <= display ? 'opacity-100' : 'opacity-30'
            )}
          >
            ★
          </button>
        ))}
      </div>
      {display && (
        <span className="text-sm font-medium text-gray-600">{STAR_LABELS[display]}</span>
      )}
    </div>
  );
}
