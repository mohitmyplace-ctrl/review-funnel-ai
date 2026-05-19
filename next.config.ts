import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Strict mode catches double-invocation bugs in development
  reactStrictMode: true,

  // Only the Google Places hostname is ever fetched server-side
  // (client-side fetch goes through our own /api/venues/search proxy)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
