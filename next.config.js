/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      { source: "/16-9", destination: "/16-9-image-generator", permanent: true },
      { source: "/youtube-16-9", destination: "/16-9-image-generator", permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/nb169-app", destination: "/nb169-app/index.html" },
    ];
  },
};
module.exports = nextConfig;
