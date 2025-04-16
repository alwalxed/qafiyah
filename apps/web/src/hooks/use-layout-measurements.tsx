'use client';

import { useLayoutStore } from '@/store/layout-store';
import { type RefObject, useEffect } from 'react';

type LayoutMeasurementsProps = {
  navRef: RefObject<HTMLElement | null>;
  footerRef: RefObject<HTMLElement | null>;
};

export function useLayoutMeasurements({ navRef, footerRef }: LayoutMeasurementsProps) {
  const { setNavHeight, setFooterHeight, setWindowHeight } = useLayoutStore();

  useEffect(() => {
    // Initial measurement
    if (navRef.current) {
      setNavHeight(navRef.current.getBoundingClientRect().height);
    }

    if (footerRef.current) {
      setFooterHeight(footerRef.current.getBoundingClientRect().height);
    }

    setWindowHeight(window.innerHeight);

    // Set up resize observers for nav and footer
    const navObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use getBoundingClientRect() to get the full height including borders and padding
        const height = entry.target.getBoundingClientRect().height;
        setNavHeight(height);
      }
    });

    const footerObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use getBoundingClientRect() to get the full height including borders and padding
        const height = entry.target.getBoundingClientRect().height;
        setFooterHeight(height);
      }
    });

    // Observe elements if they exist
    if (navRef.current) {
      navObserver.observe(navRef.current);
    }

    if (footerRef.current) {
      footerObserver.observe(footerRef.current);
    }

    // Handle window resize
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      navObserver.disconnect();
      footerObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [navRef, footerRef, setNavHeight, setFooterHeight, setWindowHeight]);

  return useLayoutStore;
}
