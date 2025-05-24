import { SITE_NAME } from '@/constants/GLOBALS';
import { htmlHeadMetadata } from '@/constants/SITE_METADATA';
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    description: htmlHeadMetadata.description,
    start_url: '/',
    display: 'standalone',
    background_color: htmlHeadMetadata.themeColorHexCode,
    theme_color: htmlHeadMetadata.themeColorHexCode,
    dir: 'rtl',
    lang: 'ar',
    categories: ['research', 'education', 'literature', 'poetry'],
    prefer_related_applications: false,
    orientation: 'portrait',
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
  };
}
