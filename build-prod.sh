#!/bin/bash
# Production build script with minimal dependencies

echo "Starting optimized production build..."

# Backup original package.json
cp package.json package.backup.json

# Use production package.json
cp package.prod.json package.json

# Clean install with production deps only
echo "Installing production dependencies only..."
rm -rf node_modules
npm install --production --no-audit --no-fund

# Build the app
echo "Building Next.js app..."
npm run build

# Restore original package.json
cp package.backup.json package.json

echo "Build complete!"