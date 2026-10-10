import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Use environment variable for base URL, fallback to localhost for development
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`,
      },
    ];
  },

  images: {
    domains: [
      'images.unsplash.com',
      'localhost',
      // Production domain will be added at runtime via environment variable
    ],
  },
};

export default nextConfig;