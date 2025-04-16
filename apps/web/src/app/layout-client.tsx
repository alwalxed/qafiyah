'use client';

import { Footer } from '@/components/footer';
import { MobileMenu } from '@/components/nav/mobile-menu';
import { Nav } from '@/components/nav/nav';
import { useLayoutMeasurements } from '@/hooks/use-layout-measurements';
import { Providers } from '@/providers/react-query';
import { useLayoutStore } from '@/store/layout-store';
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
  return (
    <div className="justify-start items-center flex flex-col relative overflow-x-hidden text-zinc-950 w-full px-4 md:px-20 lg:px-40 xl:px-60 2xl:px-80">
      <Providers>
        <Nav ref={navRef} />
        <MobileMenu />
        <main
          style={{ minHeight: remainingHeight }}
          className="min-h-[80svh] w-full flex justify-center items-center"
        >
          {children}
        </main>
        <Footer ref={footerRef} />
      </Providers>
    </div>
  );
}
