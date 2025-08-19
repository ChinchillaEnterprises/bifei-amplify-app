import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export for Amplify SSR deployment
  // output: 'export',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
