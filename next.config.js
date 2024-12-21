/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.config.ts');

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['images.unsplash.com']
  },
  // Optimize for WebContainer environment
  output: 'standalone',
  experimental: {
    // Disable features that require native modules
    forceSwcTransforms: true,
    swcTraceProfiling: false,
    esmExternals: false
  }
};

module.exports = withNextIntl(nextConfig);