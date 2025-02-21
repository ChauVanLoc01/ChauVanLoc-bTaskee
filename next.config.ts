import type { NextConfig } from "next";

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/question-one',
        permanent: true,
      },
    ]
  },
  publicRuntimeConfig: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com',
  },
}

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
