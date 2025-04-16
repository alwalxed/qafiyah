'use client';

import { useLayoutDebug, useLayoutStore } from '@/store/layout-store';

export function LayoutDebug() {
  // This will log the store values to the console whenever they change
  useLayoutDebug();

  const { navHeight, footerHeight, viewportHeight, remainingHeight } = useLayoutStore();

  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-2 text-xs z-50 rounded-tr-md">
      <div>Nav: {navHeight.toFixed(0)}px</div>
      <div>Footer: {footerHeight.toFixed(0)}px</div>
      <div>Viewport: {viewportHeight.toFixed(0)}px</div>
      <div>Remaining: {remainingHeight.toFixed(0)}px</div>
    </div>
  );
}
