import { NextRequest, NextResponse } from 'next/server';
import { generateReviewDraft } from '@/lib/review-engine';
import type { ReviewDraftRequest, StarRating } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: ReviewDraftRequest = await req.json();
    const { starRating, tags, venueName, venueCategory } = body;

    if (!starRating || starRating < 1 || starRating > 5) {
      return NextResponse.json({ error: 'Invalid star rating' }, { status: 400 });
    }

    const { draft, persona } = generateReviewDraft(starRating as StarRating, tags ?? [], {
      venueName,
      venueCategory,
      tags: tags ?? [],
    });

    const sessionId = crypto.randomUUID();

    return NextResponse.json({ draft, persona, sessionId });
  } catch {
    return NextResponse.json({ error: 'Failed to generate draft' }, { status: 500 });
  }
}
