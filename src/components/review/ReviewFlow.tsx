'use client';

import { useState } from 'react';
import { StarPicker } from './StarPicker';
import { TagPicker } from './TagPicker';
import { Button } from '@/components/ui/button';
import type { StarRating, VenueCategory, ReviewDraftResponse } from '@/types';

type Step = 'stars' | 'tags' | 'draft';

interface ReviewFlowProps {
  venueName?: string;
  venueCategory?: VenueCategory;
  venueId?: string;
  googleReviewUrl?: string;
}

export function ReviewFlow({ venueName, venueCategory, venueId, googleReviewUrl }: ReviewFlowProps) {
  const [step, setStep] = useState<Step>('stars');
  const [stars, setStars] = useState<StarRating | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [result, setResult] = useState<ReviewDraftResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateDraft() {
    if (!stars) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/review/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starRating: stars, tags, venueName, venueCategory, venueId }),
      });

      if (!res.ok) throw new Error('Failed to generate');
      const data: ReviewDraftResponse = await res.json();
      setResult(data);
      setStep('draft');
    } catch {
      setError('Could not generate review. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function copyAndRedirect() {
    if (!result) return;
    await navigator.clipboard.writeText(result.draft);
    setCopied(true);

    if (googleReviewUrl) {
      setTimeout(() => window.open(googleReviewUrl, '_blank'), 800);
    }
  }

  function regenerate() {
    setResult(null);
    generateDraft();
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {venueName && (
        <div className="text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Reviewing</p>
          <h2 className="text-2xl font-bold text-gray-900">{venueName}</h2>
        </div>
      )}

      {step === 'stars' && (
        <div className="space-y-6">
          <p className="text-center text-lg text-gray-700">How was your experience?</p>
          <StarPicker value={stars} onChange={setStars} />
          <Button
            size="lg"
            className="w-full"
            disabled={!stars}
            onClick={() => setStep('tags')}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 'tags' && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-gray-700">What stood out?</p>
            <p className="text-sm text-gray-500">Select all that apply (optional)</p>
          </div>
          <TagPicker selected={tags} onChange={setTags} />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setStep('stars')}>
              Back
            </Button>
            <Button className="flex-1" onClick={generateDraft} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Review'}
            </Button>
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </div>
      )}

      {step === 'draft' && result && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            <p className="text-gray-800 leading-relaxed text-base">{result.draft}</p>
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={copyAndRedirect}
            >
              {copied
                ? googleReviewUrl
                  ? '✓ Copied — Opening Google Reviews...'
                  : '✓ Copied to clipboard'
                : googleReviewUrl
                  ? 'Copy & Open Google Reviews'
                  : 'Copy to clipboard'}
            </Button>

            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="flex-1" onClick={regenerate}>
                Try different version
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => {
                setStep('stars');
                setStars(null);
                setTags([]);
                setResult(null);
                setCopied(false);
              }}>
                Start over
              </Button>
            </div>
          </div>

          {copied && !googleReviewUrl && (
            <p className="text-center text-sm text-gray-500">
              Paste your review on Google Maps, Zomato, or wherever you&apos;d like.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
