import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces } from '@/lib/google-places';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const city = searchParams.get('city') ?? undefined;

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 });
  }

  try {
    const places = await searchPlaces(query, city);
    return NextResponse.json({ places });
  } catch (err) {
    console.error('Places search failed:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
