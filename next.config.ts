import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for deployment
  output: 'export',
  images: {
    unoptimized: true
  },
  // Disable features that slow down build
  compress: false,
  poweredByHeader: false,
  // Skip all checks during build
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  // No experimental features needed
};

export default nextConfig;
