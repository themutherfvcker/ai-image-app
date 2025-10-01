/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      { source: "/16-9", destination: "/16-9-image-generator", permanent: true },
      { source: "/youtube-16-9", destination: "/16-9-image-generator", permanent: true },
    ]
  },
  async rewrites() {
    const origin = process.env.NB_169_ORIGIN || "https://nb-169-app.vercel.app"
    return [
      {
        source: "/16-9-image-generator",
        destination: `${origin}/`,
      },
      {
        source: "/16-9-image-generator/:path*",
        destination: `${origin}/:path*`,
      },
    ]
  },
};
module.exports = nextConfig;
