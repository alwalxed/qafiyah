import { DOMAIN } from '@/constants/GLOBALS';
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

setupDevPlatform().catch(console.error);

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: `https://www.${DOMAIN}`,
          },
        ],
        destination: `https://${DOMAIN}`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
