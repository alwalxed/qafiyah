'use client';

import { useEffect, useRef } from 'react';
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

export const useLayoutStore = create<LayoutStore>((set, get) => ({
  navHeight: 0,
  footerHeight: 0,
  viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  additionalOffset: 0,

  get remainingHeight() {
    const { navHeight, footerHeight, viewportHeight, additionalOffset } = get();
    const calculated = viewportHeight - navHeight - footerHeight - additionalOffset;
    return calculated > 0 ? calculated : 0;
  },

  setNavHeight: (height) =>
    set((state) => {
      // Only update if the height has actually changed
      if (state.navHeight !== height) {
        return { navHeight: height };
      }
      return {};
    }),

  setFooterHeight: (height) =>
    set((state) => {
      // Only update if the height has actually changed
      if (state.footerHeight !== height) {
        return { footerHeight: height };
      }
      return {};
    }),

  setViewportHeight: (height) =>
    set((state) => {
      // Only update if the height has actually changed
      if (state.viewportHeight !== height) {
        return { viewportHeight: height };
      }
      return {};
    }),

  setAdditionalOffset: (offset) =>
    set((state) => {
      // Only update if the offset has actually changed
      if (state.additionalOffset !== offset) {
        return { additionalOffset: offset };
      }
      return {};
    }),
}));

/**
 * Hook to measure an element and update its height in the layout store
 */
export function useMeasureElement(elementType: 'nav' | 'footer') {
  // Store the previous height to avoid unnecessary updates
  const prevHeightRef = useRef<number>(0);
  // Store the ResizeObserver instance for cleanup
  const observerRef = useRef<ResizeObserver | null>(null);

  // Get the setter function based on element type
  const setter =
    elementType === 'nav'
      ? useLayoutStore.getState().setNavHeight
      : useLayoutStore.getState().setFooterHeight;

  // Create a callback ref function
  const refCallback = (element: HTMLElement | null) => {
    // Clean up previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!element) return;

    const updateHeight = () => {
      const height = element.offsetHeight || 0;

      // Only update if the height has changed
      if (height !== prevHeightRef.current) {
        prevHeightRef.current = height;
        setter(height);
      }
    };

    // Initial measurement
    updateHeight();

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
  const prevHeightRef = useRef<number>(0);

  useEffect(() => {
    const updateViewportHeight = () => {
      const height = window.innerHeight;

      // Only update if the height has changed
      if (height !== prevHeightRef.current) {
        prevHeightRef.current = height;
        useLayoutStore.getState().setViewportHeight(height);
      }
    };

    // Initial height
    updateViewportHeight();

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
  }, []);
}
