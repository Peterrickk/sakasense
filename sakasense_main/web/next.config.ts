import type { NextConfig } from "next";

// The dashboard is served under /app on the same domain as the main website (see the repo-root
// vercel.json). Vercel passes the full path through, so Next.js must know the prefix.
const basePath = "/app";

const nextConfig: NextConfig = {
  basePath,
  // Exposed so plain <img> and next/image `src` values can be prefixed (basePath only applies to links).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  images: {
    domains: [
      'images.unsplash.com',
      'localhost',
      // Production domain will be added at runtime via environment variable
    ],
  },
};

export default nextConfig;
