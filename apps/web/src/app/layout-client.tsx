'use client';

import { Footer } from '@/components/footer';
import { MobileMenu } from '@/components/nav/mobile-menu';
import { Nav } from '@/components/nav/nav';
import { useLayoutMeasurements } from '@/hooks/use-layout-measurements';
import { Providers } from '@/providers/react-query';
import { useLayoutStore } from '@/stores/layout-store';
import { useRef } from 'react';

export function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useLayoutMeasurements({ navRef, footerRef });

  const { remainingHeight } = useLayoutStore();

  const minHeight = remainingHeight === 0 ? '85svh' : `${remainingHeight}px`;
  return (
    <>
      <Providers>
        <Nav ref={navRef} />
        <MobileMenu />
        <main className="w-full flex justify-center items-center" style={{ minHeight }}>
          {children}
        </main>
        <Footer ref={footerRef} />
      </Providers>
    </>
  );
}
