import { notFound } from 'next/navigation';
import { ReviewFlow } from '@/components/review/ReviewFlow';

// Static demo venues for alpha — replace with Supabase lookup when DB is wired
const DEMO_VENUES: Record<string, {
  name: string;
  category: 'restaurant' | 'cafe' | 'hotel' | 'shop' | 'service' | 'other';
  googleReviewUrl: string;
}> = {
  'demo-restaurant': {
    name: 'The Demo Kitchen',
    category: 'restaurant',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
  },
  'demo-cafe': {
    name: 'Brew & Co',
    category: 'cafe',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ScanPage({ params }: Props) {
  const { slug } = await params;
  const venue = DEMO_VENUES[slug];

  if (!venue) notFound();

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Quick Review</p>
        </div>
        <ReviewFlow
          venueName={venue.name}
          venueCategory={venue.category}
          googleReviewUrl={venue.googleReviewUrl}
        />
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const venue = DEMO_VENUES[slug];
  return {
    title: venue ? `Review ${venue.name}` : 'Review',
  };
}
