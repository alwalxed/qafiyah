'use client';

import { useState, useEffect, useRef, type RefObject } from 'react';

/**
 * A hook that calculates the remaining height of the screen after subtracting
 * the heights of specified elements (like navigation and footer).
 *
 * @param navRef - Reference to the navigation element
 * @param footerRef - Reference to the footer element
 * @param additionalOffset - Any additional pixels to subtract (optional)
 * @returns The remaining height in pixels
 */
export function useRemainingHeight(
  navRef: RefObject<HTMLElement>,
  footerRef: RefObject<HTMLElement>,
  additionalOffset = 0
): number {
  const [remainingHeight, setRemainingHeight] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Function to calculate the remaining height
    const calculateHeight = () => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }

      // Use requestAnimationFrame for performance
      rafRef.current = window.requestAnimationFrame(() => {
        // Get viewport height
        const viewportHeight = window.innerHeight;

        // Get nav height
        const navHeight = navRef.current ? navRef.current.offsetHeight : 0;

        // Get footer height
        const footerHeight = footerRef.current ? footerRef.current.offsetHeight : 0;

        // Calculate remaining height
        const calculatedHeight = viewportHeight - navHeight - footerHeight - additionalOffset;

        // Update state if changed
        if (calculatedHeight !== remainingHeight) {
          setRemainingHeight(calculatedHeight);
        }
      });
    };

    // Calculate initial height
    calculateHeight();

    // Recalculate on resize
    window.addEventListener('resize', calculateHeight);

    // Cleanup
    return () => {
      window.removeEventListener('resize', calculateHeight);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [navRef, footerRef, additionalOffset, remainingHeight]);

  return remainingHeight;
}

/**
 * Example usage:
 *
 * function Layout() {
 *   const navRef = useRef<HTMLElement>(null)
 *   const footerRef = useRef<HTMLElement>(null)
 *   const remainingHeight = useRemainingHeight(navRef, footerRef)
 *
 *   return (
 *     <>
 *       <nav ref={navRef}>Navigation</nav>
 *       <main style={{ height: `${remainingHeight}px` }}>Content</main>
 *       <footer ref={footerRef}>Footer</footer>
 *     </>
 *   )
 * }
 */
