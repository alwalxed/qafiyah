'use client';

import { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';

type LayoutStore = {
  navHeight: number;
  footerHeight: number;
  viewportHeight: number;
  additionalOffset: number;
  remainingHeight: number;

  setNavHeight: (height: number) => void;
  setFooterHeight: (height: number) => void;
  setViewportHeight: (height: number) => void;
  setAdditionalOffset: (offset: number) => void;
};

// Helper function to calculate remaining height
function calculateRemainingHeight(
  navHeight: number,
  footerHeight: number,
  viewportHeight: number,
  additionalOffset: number
): number {
  console.log('Calculating remaining height with:', {
    navHeight,
    footerHeight,
    viewportHeight,
    additionalOffset,
  });
  const calculated = viewportHeight - navHeight - footerHeight - additionalOffset;
  return calculated > 0 ? calculated : 0;
}

export const useLayoutStore = create<LayoutStore>((set) => {
  // Initialize with default values
  const initialViewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

  return {
    navHeight: 0,
    footerHeight: 0,
    viewportHeight: initialViewportHeight,
    additionalOffset: 0,
    remainingHeight: initialViewportHeight, // Start with full height

    setNavHeight: (height) =>
      set((state) => {
        if (state.navHeight !== height) {
          console.log('Setting nav height:', height);
          const remainingHeight = calculateRemainingHeight(
            height,
            state.footerHeight,
            state.viewportHeight,
            state.additionalOffset
          );
          return { navHeight: height, remainingHeight };
        }
        return {};
      }),

    setFooterHeight: (height) =>
      set((state) => {
        if (state.footerHeight !== height) {
          console.log('Setting footer height:', height);
          const remainingHeight = calculateRemainingHeight(
            state.navHeight,
            height,
            state.viewportHeight,
            state.additionalOffset
          );
          return { footerHeight: height, remainingHeight };
        }
        return {};
      }),

    setViewportHeight: (height) =>
      set((state) => {
        if (state.viewportHeight !== height) {
          console.log('Setting viewport height:', height);
          const remainingHeight = calculateRemainingHeight(
            state.navHeight,
            state.footerHeight,
            height,
            state.additionalOffset
          );
          return { viewportHeight: height, remainingHeight };
        }
        return {};
      }),

    setAdditionalOffset: (offset) =>
      set((state) => {
        if (state.additionalOffset !== offset) {
          const remainingHeight = calculateRemainingHeight(
            state.navHeight,
            state.footerHeight,
            state.viewportHeight,
            offset
          );
          return { additionalOffset: offset, remainingHeight };
        }
        return {};
      }),
  };
});

/**
 * Hook to measure an element and update its height in the layout store
 */
export function useMeasureElement(elementType: 'nav' | 'footer') {
  const setNavHeight = useLayoutStore((state) => state.setNavHeight);
  const setFooterHeight = useLayoutStore((state) => state.setFooterHeight);
  const [measured, setMeasured] = useState(false);

  // Store the previous height to avoid unnecessary updates
  const prevHeightRef = useRef<number>(0);
  // Store the ResizeObserver instance for cleanup
  const observerRef = useRef<ResizeObserver | null>(null);

  // Get the setter function based on element type
  const setter = elementType === 'nav' ? setNavHeight : setFooterHeight;

  // Create a callback ref function
  const refCallback = (element: HTMLElement | null) => {
    // Clean up previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!element) return;

    const updateHeight = () => {
      const height = element.getBoundingClientRect().height;

      // Only update if the height has changed
      if (height !== prevHeightRef.current || !measured) {
        console.log(`Measured ${elementType} height:`, height);
        prevHeightRef.current = height;
        setter(height);
        setMeasured(true);
      }
    };

    // Initial measurement - use setTimeout to ensure the element is fully rendered
    setTimeout(updateHeight, 0);

    // Set up resize observer for dynamic height changes
    observerRef.current = new ResizeObserver(() => {
      // Use requestAnimationFrame to throttle updates
      window.requestAnimationFrame(updateHeight);
    });

    observerRef.current.observe(element);
  };

  // Clean up the observer when the component unmounts
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return refCallback;
}

/**
 * Hook to update viewport height on resize
 */
export function useViewportHeight() {
  const setViewportHeight = useLayoutStore((state) => state.setViewportHeight);
  const prevHeightRef = useRef<number>(0);

  useEffect(() => {
    const updateViewportHeight = () => {
      const height = window.innerHeight;

      // Only update if the height has changed
      if (height !== prevHeightRef.current) {
        console.log('Setting viewport height:', height);
        prevHeightRef.current = height;
        setViewportHeight(height);
      }
    };

    // Initial height - use setTimeout to ensure it runs after the component mounts
    setTimeout(updateViewportHeight, 0);

    // Throttle resize events
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewportHeight, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [setViewportHeight]);
}

/**
 * Debug hook to log layout store values
 */
export function useLayoutDebug() {
  const store = useLayoutStore();

  useEffect(() => {
    console.log('Layout store values:', {
      navHeight: store.navHeight,
      footerHeight: store.footerHeight,
      viewportHeight: store.viewportHeight,
      additionalOffset: store.additionalOffset,
      remainingHeight: store.remainingHeight,
    });
  }, [
    store.navHeight,
    store.footerHeight,
    store.viewportHeight,
    store.additionalOffset,
    store.remainingHeight,
  ]);
}
