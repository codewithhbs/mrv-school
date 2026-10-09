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
    ];
  },
};

module.exports = nextConfig;
