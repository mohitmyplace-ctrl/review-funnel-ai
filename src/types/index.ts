export type StarRating = 1 | 2 | 3 | 4 | 5;

export type ReviewPersona = 'casual' | 'enthusiastic' | 'measured' | 'descriptive' | 'brief';

export type VenueCategory = 'restaurant' | 'cafe' | 'hotel' | 'shop' | 'service' | 'other';

export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  address: string;
  city: string;
  googlePlaceId?: string;
  googleReviewUrl?: string;
  merchantId?: string;
  qrSlug?: string;
  createdAt: string;
}

export interface QRCampaign {
  id: string;
  venueId: string;
  slug: string;
  label: string;
  isActive: boolean;
  createdAt: string;
}

export interface ReviewSession {
  id: string;
  venueId: string | null;
  slug: string | null;
  starRating: StarRating;
  tags: string[];
  persona: ReviewPersona;
  draftText: string;
  copiedAt: string | null;
  redirectedAt: string | null;
  platform: string | null;
  createdAt: string;
}

export interface Merchant {
  id: string;
  email: string;
  businessName: string;
  plan: 'free' | 'starter' | 'pro';
  createdAt: string;
}

export interface DashboardMetrics {
  totalScans: number;
  totalCopies: number;
  totalRedirects: number;
  copyRate: number;
  redirectRate: number;
  byStarRating: Record<StarRating, number>;
}

export interface ReviewDraftRequest {
  venueId?: string;
  starRating: StarRating;
  tags: string[];
  venueName?: string;
  venueCategory?: VenueCategory;
}

export interface ReviewDraftResponse {
  draft: string;
  persona: ReviewPersona;
  sessionId: string;
}

export interface GooglePlace {
  placeId: string;
  name: string;
  address: string;
  category: VenueCategory;
  rating?: number;
  reviewUrl: string;
}
