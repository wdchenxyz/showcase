import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Uncomment if deploying to username.github.io/showcase
  // basePath: '/showcase',
  // assetPrefix: '/showcase',
};

export default nextConfig;
