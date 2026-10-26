/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
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
