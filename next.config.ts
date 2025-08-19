import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export for full-stack Amplify deployment
  // output: 'export',  // Disabled for dynamic deployment
  images: {
    unoptimized: true
  },
  // Enable build optimizations for production
  compress: true,
  poweredByHeader: false,
  // Enable TypeScript and ESLint checks
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  },
  // Allow cross-origin requests for development
  allowedDevOrigins: ['10.0.0.131'],
};

export default nextConfig;
