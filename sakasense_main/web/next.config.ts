import type { NextConfig } from "next";

// The dashboard is served under /app on the same domain as the main website (see the repo-root
// vercel.json). Vercel passes the full path through, so Next.js must know the prefix.
const basePath = "/app";

const nextConfig: NextConfig = {
  basePath,
  // Exposed so plain <img> and next/image `src` values can be prefixed (basePath only applies to links).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  // Serve images straight from /public: on the multi-service Vercel deployment (vercel.json) the
  // /_next/image optimizer route returns 404, which left every <Image> blank.
  images: {
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'localhost',
      // Production domain will be added at runtime via environment variable
    ],
  },
};

export default nextConfig;
