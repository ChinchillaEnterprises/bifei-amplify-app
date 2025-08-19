import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use static export for faster builds
  output: 'export',
  images: {
    unoptimized: true
  },
  // Optimize build for production
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // Reduce build time
  typescript: {
    // Skip type checking during build (already done in CI)
    ignoreBuildErrors: false
  },
  eslint: {
    // Skip ESLint during build to save time
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
