/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Long-lived browser caching for static images in /public (Next already caches /_next/static).
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
    ];
  },
  async redirects() {
    return [
      // www + old /news-events URLs → final /blog URL in ONE hop (no www → non-www → /blog chain).
      {
        source: '/news-events',
        has: [{ type: 'host', value: 'www.mrvpublicschool.com' }],
        destination: 'https://mrvpublicschool.com/blog',
        permanent: true,
      },
      {
        source: '/news-events/:slug',
        has: [{ type: 'host', value: 'www.mrvpublicschool.com' }],
        destination: 'https://mrvpublicschool.com/blog/:slug',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.mrvpublicschool.com' }],
        destination: 'https://mrvpublicschool.com/:path*',
        permanent: true,
      },
      // Old "News & Events" URLs now live under /blog — keep Google rankings & shared links working.
      { source: '/news-events', destination: '/blog', permanent: true },
      { source: '/news-events/:slug', destination: '/blog/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;
