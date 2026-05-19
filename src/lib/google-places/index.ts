import type { GooglePlace, VenueCategory } from '@/types';

const PLACES_API_BASE = 'https://places.googleapis.com/v1';

function inferCategory(types: string[]): VenueCategory {
  if (types.some(t => ['restaurant', 'food', 'meal_takeaway', 'meal_delivery'].includes(t))) return 'restaurant';
  if (types.some(t => ['cafe', 'bakery', 'coffee_shop'].includes(t))) return 'cafe';
  if (types.some(t => ['lodging', 'hotel', 'motel', 'guest_house'].includes(t))) return 'hotel';
  if (types.some(t => ['store', 'shop', 'supermarket', 'convenience_store'].includes(t))) return 'shop';
  return 'other';
}

function buildGoogleReviewUrl(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

interface PlacesSearchResult {
  places?: Array<{
    id: string;
    displayName: { text: string };
    formattedAddress: string;
    types: string[];
    rating?: number;
  }>;
}

export async function searchPlaces(query: string, city?: string): Promise<GooglePlace[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY is not configured');

  const textQuery = city ? `${query} in ${city}` : query;

  const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.types,places.rating',
    },
    body: JSON.stringify({ textQuery, maxResultCount: 8 }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Places API error: ${err}`);
  }

  const data: PlacesSearchResult = await response.json();

  return (data.places ?? []).map(place => ({
    placeId: place.id,
    name: place.displayName.text,
    address: place.formattedAddress,
    category: inferCategory(place.types ?? []),
    rating: place.rating,
    reviewUrl: buildGoogleReviewUrl(place.id),
  }));
}

export { buildGoogleReviewUrl, inferCategory };
