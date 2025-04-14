'use client';

import { Footer } from '@/components/layout/footer';
import { MobileMenu } from '@/components/nav/mobile-menu';
import { Nav } from '@/components/nav/nav';
import { isDev } from '@/lib/constants';
import { Providers } from '@/providers/react-query';
import { useLayoutStore, useMeasureElement, useViewportHeight } from '@/store/layout-store';
import type React from 'react';

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navRef = useMeasureElement('nav');
  const footerRef = useMeasureElement('footer');

  // Set up viewport height listener
  useViewportHeight();

  const remainingHeight = useLayoutStore((state) => state.remainingHeight);

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
          <Nav ref={navRef} />
          <MobileMenu />
          <main
            style={{
              minHeight: remainingHeight ? `${remainingHeight}px` : '50vh',
              transition: 'min-height 0.2s ease-out',
            }}
            className="overflow-auto"
          >
            {children}
          </main>
          <Footer ref={footerRef} />
        </Providers>
      </body>
    </html>
  );
}
