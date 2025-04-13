import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

setupDevPlatform().catch(console.error);

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
