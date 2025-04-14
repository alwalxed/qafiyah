import { defaultMetadata, SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/lib/constants';
import type { Metadata, Viewport } from 'next';
import type React from 'react';
import ClientRootLayout from './client-layout';
import './globals.css';

export const metadata: Metadata = {
  title: defaultMetadata.title,
  description: defaultMetadata.description,
  keywords: defaultMetadata.keywords,
  authors: [{ name: defaultMetadata.author }],
  creator: defaultMetadata.poetName,
  publisher: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    languages: {
      ar: '/',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'ar_AR',
    url: SITE_URL,
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    images: [
      {
        url: defaultMetadata.openGraphUrl,
        width: 1200,
        height: 630,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [defaultMetadata.openGraphUrl],
  },
  other: {
    'apple-mobile-web-app-title': SITE_NAME,
    'application-name': SITE_NAME,
    copyright: defaultMetadata.poetName,
    abstract: defaultMetadata.description,
    google: 'notranslate',
  },
  generator: 'v0.dev',
};

export const viewport: Viewport = {
  themeColor: '#fafafa',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientRootLayout>{children}</ClientRootLayout>;
}
