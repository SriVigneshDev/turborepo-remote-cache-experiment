import type { NextConfig } from 'next'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// ============================================
// ESM __dirname WORKAROUND
// ============================================
// In ESM modules, __dirname is not available by default
// These lines recreate __dirname for use in this config
const Filename = fileURLToPath(import.meta.url)
const Dirname = dirname(Filename)

const nextConfig: NextConfig = {
  // ============================================
  // REQUIRED FOR DOCKER
  // ============================================

  // Creates a standalone folder with minimal dependencies
  // This bundles only necessary files for production
  // Without this, Docker COPY will fail!
  //
  // Creates: .next/standalone/
  // ├── server.js          ← Production entry point
  // ├── node_modules/      ← Only required deps (~5MB vs ~500MB)
  // └── apps/web/          ← Your app files
  output: 'standalone',

  // ============================================
  // REQUIRED FOR MONOREPO
  // ============================================

  // Tells Next.js to trace dependencies from monorepo root
  // Without this, workspace packages won't be included in standalone
  //
  // Your structure:
  // turborepo/              ← This is root (../../ from here)
  // ├── apps/
  // │   └── web/           ← You are here
  // │       └── next.config.ts
  // └── packages/
  //     └── ui/            ← Needs to be traced
  outputFileTracingRoot: join(Dirname, '../../'),

  // ============================================
  // WORKSPACE PACKAGES
  // ============================================

  // List ALL workspace packages this app imports
  // These packages will be transpiled (compiled) with your app
  //
  // How to know what to add:
  // Check your package.json dependencies for @repo/* packages
  //
  // Example:
  // "dependencies": {
  //   "@repo/ui": "workspace:*",      ← Add '@repo/ui'
  //   "@repo/shared": "workspace:*",  ← Add '@repo/shared'
  // }
  //
  // DON'T add: react, next, axios (these are pre-compiled npm packages)
  transpilePackages: ['@repo/ui'],

  // ============================================
  // RECOMMENDED SETTINGS
  // ============================================

  // Enables React Strict Mode for better development experience
  // - Catches bugs early
  // - Warns about deprecated APIs
  // - Components render twice in dev (intentional for detecting side effects)
  reactStrictMode: true,

  // Enables gzip compression for responses
  // - Reduces file sizes by ~70%
  // - Faster page loads
  // Note: If using nginx/Cloudflare, they also handle compression
  compress: true,
}

export default nextConfig
