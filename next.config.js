/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      { source: "/16-9", destination: "/16-9-image-generator", permanent: true },
      { source: "/youtube-16-9", destination: "/16-9-image-generator", permanent: true },
    ]
  },
};
module.exports = nextConfig;
