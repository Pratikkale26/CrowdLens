/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'crowdlens-storage.blr1.cdn.digitaloceanspaces.com',
        port: '',
        pathname: '/user/**',
      },
    ],
  },
};

module.exports = nextConfig; 