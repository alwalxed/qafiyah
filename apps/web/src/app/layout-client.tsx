'use client';

import { Footer } from '@/components/footer';
import { MobileMenu } from '@/components/nav/mobile-menu';
import { Nav } from '@/components/nav/nav';
import { useLayoutMeasurements } from '@/hooks/use-layout-measurements';
import { Providers } from '@/providers/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { useRef } from 'react';

export function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useLayoutMeasurements({ navRef, footerRef });

  return (
    <>
      <Providers>
        <NuqsAdapter>
          <Nav ref={navRef} />
          <MobileMenu />
          <main className="w-full flex justify-start items-start h-full">{children}</main>
          <Footer ref={footerRef} />
        </NuqsAdapter>
      </Providers>
    </>
  );
}
