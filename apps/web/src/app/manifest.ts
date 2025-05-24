import { SITE_NAME } from '@/constants/GLOBALS';
import { NAV_LINKS } from '@/constants/NAV_LINKS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
import type { MetadataRoute } from 'next';

type Icon = {
  src: string;
  type?: string | undefined;
  sizes?: string | undefined;
  purpose?: 'any' | 'maskable' | 'monochrome' | undefined;
};

type Shortcut = {
  name: string;
  short_name?: string | undefined;
  description?: string | undefined;
  url: string;
  icons?: Icon[] | undefined;
};

export default function manifest(): MetadataRoute.Manifest {
  const shortcuts: Shortcut[] = NAV_LINKS.map((link) => ({
    name: link.name,
    short_name: link.name,
    description: `انتقل إلى «${link.name}»`,
    url: link.href,
    icons: [
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }));

  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: htmlHeadMetadata.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: htmlHeadMetadata.themeColorHexCode,
    theme_color: htmlHeadMetadata.themeColorHexCode,
    dir: 'rtl',
    lang: 'ar',
    categories: ['research', 'education', 'literature', 'poetry'],
    prefer_related_applications: false,
    orientation: 'portrait',

    shortcuts,
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/open-graph-white.png',
        type: 'image/png',
        sizes: '1200x630',
        form_factor: 'wide',
        label: 'شعار قافية',
      },
    ],
  };
}
