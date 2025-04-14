import { Footer } from '@/components/footer';
import { MobileMenu } from '@/components/nav/mobile-menu';
import { Nav } from '@/components/nav/nav';
import { defaultMetadata, isDev, SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/lib/constants';
import { Providers } from '@/providers/react-query';
import type { Metadata, Viewport } from 'next';
import type React from 'react';
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
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`h-full w-full overflow-x-hidden ${isDev ? 'debug-screens' : ''}`}
    >
      <body
        style={{ fontFamily: 'IBMPlexSansArabic' }}
        className="min-h-svh flex flex-col relative overflow-x-hidden bg-zinc-50 text-zinc-950 w-full px-4 gap-10 xs:gap-20 md:gap-24 lg:gap-28 xl:gap-32 md:px-20 lg:px-40 xl:px-60 2xl:px-80"
      >
        <Providers>
          <Nav />
          <MobileMenu />
          <main
            style={{
              minHeight: '50vh',
              transition: 'min-height 0.2s ease-out',
            }}
            className="overflow-auto"
          >
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
