'use client';

import { cn } from '@/lib/utils';
import { AVAILABLE_TAGS } from '@/lib/review-engine';

interface TagPickerProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function TagPicker({ selected, onChange }: TagPickerProps) {
  const toggle = (tag: string) => {
    onChange(
      selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]
    );
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Object.entries(AVAILABLE_TAGS).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => toggle(key)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium border-2 transition-all',
            selected.includes(key)
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
